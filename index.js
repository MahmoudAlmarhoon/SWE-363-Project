var express = require("express")
var bodyParser  = require("body-parser")
var mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId; // Correctly reference ObjectId

const session = require('express-session');


 
const app=express()

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true }  // Set to `true` if using HTTPS
  }));
  
app.use(bodyParser.json())
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended:true
}))
 
mongoose.connect('mongodb://localhost:27017/DatabaseSWE')
var db=mongoose.connection
 
db.on('error',()=>console.log("Eroor in connection to Database"))
db.once('open',()=> console.log("Connected to Database"))
 
 
function alert1(){
    alert("hi")
}


app.post("/login", async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
 
    var data={
        "email":email,
        "password":password,
    }
    console.log("Email:", email);
    console.log("Password:", password);
 
    // Query the database to find a user with the provided email and password
    try {
        const user = await db.collection('users').findOne({ email, password });
        if (user) {
            // User found, login successful
            req.session.userId = user._id;  // Set the session with the user's ID

            return res.redirect('/MainSell.html');

            return res.send(`
<script>
                    alert('Login successful.');
                    window.location.href = '/MainSell.html';
</script>
            `);
        } else {
            // User not found or incorrect password
            return res.send(`
<script>
                    alert('Invalid email or password. Please try again.');
                    window.location.href = '/login.html'; // Redirect back to the login page
</script>
            `);
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Error during login. Please try again later.');
    }
});


app.post("/Register", async (req, res) => {
    var Fname = req.body.Fname;
    var Lname = req.body.Lname;
    var id = req.body.id;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var building = req.body.building;
    var password = req.body.password;
    var Cpassword = req.body.Cpassword;

    // Check if the email already exists in the database
    try {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            // Email already exists, send an error message to the client

            return res.send(`
                <script>
                    alert('This email address is already registered. Please use a different email.');
                    window.location.href = '/Register.html'; // Redirect back to the registration page
                </script>
            `);
        }
    } catch (error) {
        console.error('Error checking for existing email:', error);
        return res.status(500).send('Error checking for existing email. Please try again later.');
    }

    // If passwords match, insert the user data into the database
    if (password !== Cpassword) {
        // Send an error message back to the client
        return res.send(`
            <script>
                alert('Passwords do not match. Please try again.');
                window.location.href = '/Register.html'; // Redirect back to the registration page
            </script>
        `);
    }

    var data = {
        "Fname": Fname,
        "Lname": Lname,
        "id": id,
        "email": email,
        "mobile": mobile,
        "building": building,
        "password": password,
        "Cpassword": Cpassword
    };

    // Insert the user data into the database
    try {
        await db.collection('users').insertOne(data);
        console.log("Record Inserted successfully");
    } catch (error) {
        console.error('Error inserting user data:', error);
        return res.status(500).send('Error inserting user data. Please try again later.');
    }

    // Redirect the user to the main page after successful registration
    return res.redirect('/MainSell.html');
});

 
app.get("/Register",(req,res)=>{
    res.status({
        "Allow-acces-Allow-origin":"*"
    })
 
    return res.redirect("Register.html")
})
 
 
app.post("/AddItem.html",(req,res)=>{
    var bigPicture=req.body.bigPicture
    var sidePic1=req.body.sidePic1
    var sidePic2 = req.body.sidePic2
    var sidePic3 = req.body.sidePic3
    var selectedValue = req.body.selectedValue
    var productName = req.body.productName
    var price = req.body.price
    var descreption = req.body.descreption
    var quantity = req.body.quantity
 
    var data={
        "bigPicture":bigPicture,
        "sidePic1":sidePic1,
        "sidePic2":sidePic2,
        "sidePic3":sidePic3,
        "selectedValue":selectedValue,
        "productName":productName,
        "price":price,
        "descreption":descreption,
        "quantity":quantity
    }
 
 
    db.collection('Items').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inser succesfully")
    })
    return res.redirect('/MainSell.html');
 
   
 
})

app.get("/profile", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login.html'); // Redirect to login if not authenticated
    }
    try {
        // Correctly instantiate ObjectId with 'new'
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user }); // Assuming you have setup your templating engine correctly
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/getUserData", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(req.session.userId) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ fullName: user.Fname + ' ' + user.Lname, email: user.email, phone: user.phone, address: user.address });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
app.post("/updateProfile", async (req, res) => {
    // Ensure the user is authenticated
    if (!req.session.userId) {
        return res.status(401).send('You must be logged in to update profile.');
    }

    // Extract user data from request body
    const { Fname, Lname, email, phone, address } = req.body;

    try {
        // Update user in database
        const result = await db.collection('users').updateOne(
            { _id: new mongoose.Types.ObjectId(req.session.userId) },
            { $set: { Fname, Lname, email, phone, address } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send('User not found.');
        }

        // Redirect or send a success message
        res.send('Profile updated successfully.');
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/AddItem",(req,res)=>{
    res.status({
        "Allow-acces-Allow-origin":"*"
    })
 
    return res.redirect("AddItem.html")
})
// Existing routes...

// Route for the root path (/)
app.get("/", (req, res) => {
    res.redirect("login.html")
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1><p>This is the login page content.</p>');
  });
  


// Existing routes...


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
 
//.listen(3000);
 
console.log("listen to 3000");