const File = require('../models/File');
const supporting = require('../models/Supporting')
const noting = require('../models/Noting')

exports.createFile = async (req, res) => {
    try {
        console.log("Incoming body:", req.body);
        console.log("Incoming file:", req.file);

        const { type, name, number, noting, sheet } = req.body; 

        const supportFilePath = req.file ? req.file.path : null; 
        
        if (!type || !name || !number || !noting) {
            return res.status(400).json({ error: "Missing required fields or support file" });
        }

        const file = new File({
            type,
            name,
            number,
            noting,
            sheet,
            supportFile: supportFilePath
        });

        await file.save();

        return res.status(201).json({
            msg: "File saved successfully",
            file
        });

    } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: error.message || error });
    }
};


exports.getFile = async (req, res) => {
 try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.isActive) {
      filter.isActive = req.query.isActive === "true"; // filter by active/inactive
    }
    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" }; // case-insensitive search
    }

    const total = await File.countDocuments(filter);
console.log(total);

    const details = await File.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("support")
      .populate("noting")
      .lean();

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // const listDetails = details.map((detail) => ({}));

    res.json({
      details,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



