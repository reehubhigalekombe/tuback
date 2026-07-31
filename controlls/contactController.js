import User from "../models/users.js";
export const syncContacts = async(req, res) => {
    try {
        const {contacts} = req.body;
         const normalizePhone = (phone) => {
        let cleaned = phone.replace(/\D/g, "");
        if(cleaned.startsWith("0")) {
            cleaned = "254" + cleaned.substring(1)
        }

            return cleaned
        
    }
        const phoneNumbers = contacts.map(c =>normalizePhone (c.phone));
        console.log("================================");
        console.log("Phones received from the app");
        console.log(phoneNumbers)
        const allUsers = await User.find().select("_id name phone");
           console.log("=========USERS IN THE DATABASE==============");
      allUsers.forEach(user => {
        console.log(user.name, user.phone)
      })

      console.log("============PHONES FROM DEVEICE==========");
      phoneNumbers.forEach(phone => {
        console.log(phone)
      })

        const users = await User.find().select(
            "_id name handle phone avatar isOnline");
const matchedUsers = users.fileter(user => 
    phoneNumbers.includes(normalizePhone(user.phone))
);
res.json(matchedUsers)
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
