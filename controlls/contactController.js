import User from "../models/users.js";
export const syncContacts = async(req, res) => {
    try {
        const {contacts} = req.body;
        const phoneNumbers = contacts.map(c => c.phone);
        const users = await User.find({
            phone: {$in: phoneNumbers}
        }).select("_id name handle phone avatar isOnline");
        res.json(users);
        
    }catch(err) {
        console.error(err)
        res.status(500).json({
            message: "Ooops Faliled to synch contacts"
        })

    }
}
