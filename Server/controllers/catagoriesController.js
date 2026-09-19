import insuranceCategory from "../modules/insuranceCategory.js"
import fs from "fs";
import path from "path";
const addCategory = async (req, res) => {
  try {
    const { name,title } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    console.log(name,title)


    const existing = await insuranceCategory.findOne({
      name: name.trim()
    });

    if (existing) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

   
    let iconPath = "";
    if (!req.file) {
      return res.status(400).json({ message: "Icon is required" });
    }
    iconPath = req.file.path;

   
    const category = await insuranceCategory.create({
      name: name.trim(),
      icon: iconPath,  
      title: title.trim()
    });

    res.status(201).json(category);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, title } = req.body;

    if (!name && !title) {
      return res.status(400).json({ message: "Name or title is required" });
    }

    const category = await insuranceCategory.findById(productId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name.trim();
    }
    if (title) {
      category.title = title.trim();
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { productId } = req.params;
    
    console.log(productId)
    const category = await insuranceCategory.findByIdAndDelete(productId);
   
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
     if (category.icon) {
      const filePath = path.join(process.cwd(), category.icon);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("File deleted:", filePath);
      }
    }
    if(category){
      res.json({ message: "Category deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    console.log("Database:", insuranceCategory.db.name);
    console.log("Collection:", insuranceCategory.collection.name);

    const categories = await insuranceCategory.find();

    console.log("Categories:", categories);

    res.json(categories);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategory = async (req, res) => {
  try {
    const { productId } = req.params;
    const category = await insuranceCategory.findById(productId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}


export { addCategory, getCategories, updateCategory, deleteCategory, getCategory };
