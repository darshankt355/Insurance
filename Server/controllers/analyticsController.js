
import User from "../modules/users.js";

import Insurance from "../modules/insurance.js";

const handleGetTotalConsumers = async (req, res) => {
  try {
    const consumerCount = await User.countDocuments({ role: 'consumer' });
    res.status(200).json({ value: consumerCount });
  } catch (error) {
    console.error('Error fetching total consumers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const handleGetTotalEmployees = async (req, res) => {
  try {
    const employeeCount = await User.countDocuments({ role: 'employee' });
    res.status(200).json({ value: employeeCount });
  } catch (error) {
    console.error('Error fetching total employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const handleGetTotalInsurances = async (req, res) => {
  try {
    const insuranceCount = await Insurance.countDocuments();
    res.status(200).json({ value: insuranceCount });
  } catch (error) {
    console.error('Error fetching total insurances:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export { handleGetTotalConsumers, handleGetTotalEmployees, handleGetTotalInsurances };
