import User from "../models/users.js";
export const syncContacts = async(req, res) => {
    try {
        const {contacts} = req.body;
        const phoneNumbers = contacts.map(c => c.phone);
        console.log("================================");
        console.log("Phones received from the app");
        console.log(phoneNumbers)
        const allUsers = await User.find().select("_id name phone");
        console.log("Users in MongoDB");
        console.log(allUsers);

        const users = await User.find({
            phone: {$in: phoneNumbers}
        }).select("_id name handle phone avatar isOnline");
        console.log("Matched Users");
        console.log(users);
        console.log("================================");
        res.json(users);
        
    }catch(err) {
        console.error(err)
        res.status(500).json({
            message: "Ooops Faliled to synch contacts"
        })

    }
}
