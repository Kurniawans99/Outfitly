import PlannedOutfit from "../models/planner/plannedOutfit.model.js";
import WardrobeItem from "../models/wardrobe/wardrobeItem.model.js";
import InspirationPost from "../models/inspiration/inspirationPost.model.js";
import mongoose from "mongoose";

/**
 * Fungsi helper untuk melakukan populasi manual pada item-item di PlannedOutfit.
 * Ini diperlukan karena InspoItem adalah subdokumen, bukan model yang bisa di-populate langsung.
 * @param {Array<PlannedOutfit> | PlannedOutfit} outfits - Satu atau lebih dokumen PlannedOutfit.
 * @returns {Promise<Array<Object> | Object>} - Dokumen yang sudah terpopulasi.
 */
const populatePlannedOutfitItems = async (outfits) => {
  const wasSingle = !Array.isArray(outfits);
  const outfitsArray = wasSingle ? [outfits] : outfits;

  const populatedOutfits = await Promise.all(
    outfitsArray.map(async (outfit) => {
      // Ubah dokumen Mongoose menjadi objek JavaScript biasa
      const outfitObj = outfit.toObject ? outfit.toObject() : outfit;

      const populatedItems = await Promise.all(
        outfitObj.items.map(async (itemRef) => {
          if (itemRef.itemType === "WardrobeItem") {
            // Populate dari model WardrobeItem
            const wardrobeItem = await WardrobeItem.findById(
              itemRef.item
            ).lean();
            return { ...itemRef, item: wardrobeItem };
          } else if (itemRef.itemType === "InspoItem") {
            // Cari InspoItem di dalam InspirationPost
            const parentPost = await InspirationPost.findOne({
              "items._id": itemRef.item,
            }).lean();

            // Temukan subdokumen item yang spesifik dari post induknya
            const inspoItem = parentPost
              ? parentPost.items.find(
                  (i) => i._id.toString() === itemRef.item.toString()
                )
              : null;

            return { ...itemRef, item: inspoItem };
          }
          return itemRef; // Kembalikan referensi jika tipe tidak cocok
        })
      );

      outfitObj.items = populatedItems;
      return outfitObj;
    })
  );

  return wasSingle ? populatedOutfits[0] : populatedOutfits;
};

// @desc    Buat atau perbarui outfit yang direncanakan
// @route   POST /api/planner
// @access  Private
export const planOutfit = async (req, res, next) => {
  try {
    const { date, outfitName, occasion, items } = req.body; // items: [{ itemType: 'WardrobeItem', item: 'itemId' }]
    const userId = req.user._id;

    if (!date || !items || !Array.isArray(items) || items.length === 0) {
      const error = new Error("Tanggal dan item outfit wajib diisi.");
      error.statusCode = 400;
      throw error;
    }

    // Ubah tanggal menjadi format YYYY-MM-DD agar unik per hari
    const startOfDay = new Date(`${date}T00:00:00.000Z`);

    // Validasi setiap item
    for (const itemRef of items) {
      if (!itemRef.item || !mongoose.Types.ObjectId.isValid(itemRef.item)) {
        const error = new Error(`ID item tidak valid: ${itemRef.item}`);
        error.statusCode = 400;
        throw error;
      }
      if (!["WardrobeItem", "InspoItem"].includes(itemRef.itemType)) {
        const error = new Error(`Tipe item tidak valid: ${itemRef.itemType}`);
        error.statusCode = 400;
        throw error;
      }
      // Opsional: Cek apakah item benar-benar ada di database dan milik user
      if (itemRef.itemType === "WardrobeItem") {
        const foundItem = await WardrobeItem.findOne({
          _id: itemRef.item,
          user: userId,
        });
        if (!foundItem) {
          const error = new Error(
            `Wardrobe item tidak ditemukan atau bukan milik Anda: ${itemRef.item}`
          );
          error.statusCode = 404;
          throw error;
        }
      } else if (itemRef.itemType === "InspoItem") {
        // Untuk InspoItem, kita perlu cari parent InspirationPost-nya dan cek author
        const parentPost = await InspirationPost.findOne({
          "items._id": itemRef.item,
        });
        if (!parentPost) {
          const error = new Error(
            `Inspiration item tidak ditemukan: ${itemRef.item}`
          );
          error.statusCode = 404;
          throw error;
        }
      }
    }

    const plannedOutfit = await PlannedOutfit.findOneAndUpdate(
      { user: userId, date: startOfDay },
      { $set: { outfitName, occasion, items } },
      { upsert: true, new: true, runValidators: true }
    );

    const populatedOutfit = await populatePlannedOutfitItems(plannedOutfit);

    res.status(200).json({
      success: true,
      message: "Outfit berhasil direncanakan!",
      data: populatedOutfit,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dapatkan outfit yang direncanakan untuk periode tertentu (misal: seminggu)
// @route   GET /api/planner
// @access  Private
export const getPlannedOutfits = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query; // Query params: YYYY-MM-DD

    let query = { user: userId };

    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`);
      end.setHours(23, 59, 59, 999); // Pastikan end date mencakup seluruh hari

      query.date = { $gte: start, $lte: end };
    } else {
      // Jika tidak ada tanggal yang diberikan, ambil outfit 7 hari ke depan dari hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);
      query.date = { $gte: today, $lte: sevenDaysLater };
    }

    const baseOutfits = await PlannedOutfit.find(query)
      .sort({ date: 1 })
      .lean();
    const outfits = await populatePlannedOutfitItems(baseOutfits);

    res
      .status(200)
      .json({ success: true, count: outfits.length, data: outfits });
  } catch (error) {
    next(error);
  }
};

// @desc    Hapus outfit yang direncanakan
// @route   DELETE /api/planner/:id
// @access  Private
export const deletePlannedOutfit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const plannedOutfit = await PlannedOutfit.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!plannedOutfit) {
      const error = new Error(
        "Outfit tidak ditemukan atau Anda tidak punya akses."
      );
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "Outfit berhasil dihapus dari planner.",
    });
  } catch (error) {
    next(error);
  }
};
