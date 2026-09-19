
import { Contact } from "../modules/contact.js";
const handelContact = async (req, res) => {
    try {
        const body = req.body;

        const { Name, email, subject, message } = body;
        console.log(Name,email,subject,message)
        if (!Name || !email || !subject || !message) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const contact = new Contact({
            Name,
            email,
            subject,
            message
        });
        await contact.save();
        return res.status(201).json({
            message: "Contact created successfully"
        });
    } catch (error) {
        console.error("Contact Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const handelGetContact=async(req,res)=>{
    try {
        const contact=await Contact.find();
        return res.status(200).json({
            message:"Contact fetched successfully",
            contact
        })
    } catch (error) {
        console.error("Contact Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

const handelDeleteContact=async(req,res)=>{
    try {
        const id=req.params.id;
        await Contact.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Contact deleted successfully"
        })
    } catch (error) {
        console.error("Contact Error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export { handelContact,handelGetContact,handelDeleteContact };