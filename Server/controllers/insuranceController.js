
import Insurance from "../modules/insurance.js";



const handleAdddInsurance=async(req,res)=>{
    const body=req.body;
    
    const existingInsurance = await Insurance.findOne({
        planName: body.planName.trim(),
    });
    if(existingInsurance){
        return res.status(400).json({ message: "Plan name already exists" });
    }
    const newInsurance = new Insurance({
        companyName: body.companyName.trim(),
        planName: body.planName.trim(),
        category: body.category,
        basePremium: body.basePremium,
        premiumType: body.premiumType,
        coverageAmount: body.coverageAmount,
        benefits: body.benefits,
        exclusions: body.exclusions,
        redirectLink: body.redirectLink,
        status: body.status
    });
    await newInsurance.save();
    res.status(201).json(newInsurance);
}

const handleUpdateInsurance=async(req,res)=>{
    const {planId}=req.params
    const {companyName,planName,basePremium,premiumType,coverageAmount,benefits,exclusions,redirectLink}=req.body;
    if (!companyName && !planName && !basePremium && !premiumType && !coverageAmount && !benefits && !exclusions && !redirectLink) {
        return res.status(400).json({ message: "No fields to update" });
    }
    try {
        const updatedInsurance = await Insurance.findByIdAndUpdate(planId, {companyName,planName,basePremium,premiumType,coverageAmount,benefits,exclusions,redirectLink}, { new: true });
        if (!updatedInsurance) {
            return res.status(404).json({ message: "Insurance not found" });
        }
        res.json(updatedInsurance);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

const handleDeleteInsurance=async(req,res)=>{
    const {planId}=req.params
    try {
        const deletedInsurance = await Insurance.findByIdAndDelete(planId);
        if (!deletedInsurance) {
            return res.status(404).json({ message: "Insurance not found" });
        }
        res.json({ message: "Insurance deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
const getInsuranceByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const plans = await Insurance.find({ category: id });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getproductById=async(req,res)=>{
    const { planId } = req.params;
    try {
        const product = await Insurance.findById(planId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export {handleAdddInsurance,getInsuranceByCategory,getproductById,handleUpdateInsurance,handleDeleteInsurance}

