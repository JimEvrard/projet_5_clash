import express from 'express'; //import d'express
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from './public/assets/models/User.js';
import Personage from './public/assets/models/Personage.js';
import session from 'express-session';
import helper from './helper.js'

const app = express();
const db = "mongodb+srv://jimevrard:c9ThzDChWN0U6cMn@cluster0.2kilt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(db, err => {
    if (err) {
        console.error("Error" + err)
    } else {
        console.log("Connected at db")
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public/assets'));

app.listen(8081, () => {
    console.log("Servor Ok")
});

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// <-----------------------------> index <----------------------------->
app.get('/', async (req, res) => {
    console.log('test serveur'); //  coté serveur (back-end)
    let user = await User.findOne({ _id: req.session.userid })
    if (user) {
        res.redirect('/list_of_personages/' + req.session.userid);

    } else {
        res.redirect('/connect_user')
    }
})

// <-----------------------------> Create User <----------------------------->

app.get('/create_user', async (req, res) => {
    res.render('./users/create_user.html.twig', {
        url: 'create_user',
    })
})

app.post('/create_user', async (req, res) => {
    const user = new User(req.body)
    user.save();
    res.redirect('/')
})

// <-----------------------------> Connect User <----------------------------->

app.get('/connect_user', async (req, res) => {
    res.render('./users/connect_user.html.twig', {
        url: 'connect_user',
    })
});

app.post('/connect_user', async (req, res) => {
    const idUser = await User.findOne({ pseudo: req.body.pseudo, mdp: req.body.mdp })
    if (idUser) {
        req.session.userid = idUser._id
        console.log(req.session.userid);
        res.redirect('/list_of_personages/' + req.session.userid)
    } else {
        res.redirect("/connect_user")
    }


})

// <-----------------------------> Create Personage <----------------------------->

app.get('/create_personage', async (req, res) => {
    res.render('./personages/create_personage.html.twig', {
        url: 'create_personage/:id'
    })
});

app.post('/create_personage', async (req, res) => {
    const personage = new Personage(req.body)

    personage.template = helper.template_image(req.body.template_name)

    await User.updateOne(
        { _id: req.session.userid },
        {
            $push: { array_personages: personage }
        }
    )
    res.redirect('/list_of_personages/:id')
})


// <-----------------------------> List of Personage <----------------------------->

app.get('/list_of_personages/:id', async (req, res) => {
    let user = await User.findOne({ _id: req.session.userid })
    res.render('./personages/list_of_personages.html.twig', {
        user: user,
        url: 'list_of_personages/:id',
    })
})


// <-----------------------------> Update Personage <----------------------------->

app.get('/update_personage/:id', async (req, res) => {
    let personage;
    let user = await User.findOne({ _id: req.session.userid })
    for (let i = 0; i < user.array_personages.length; i++) {
        if (user.array_personages[i]._id == req.params.id) {
            personage = user.array_personages[i]
        }
    }
    res.render('./personages/create_personage.html.twig', {
        user: user,
        personage: personage,
        action: "/update_personage",
        url: 'update_personage/:id',
    })
})

app.post('/update_personage/:id', async (req, res) => {
    let user = await User.findOne({ _id: req.session.userid })
    const index = user.array_personages.findIndex(personage_id => personage_id._id == req.params.id)
    user.array_personages[index] = req.body
    user.array_personages[index]._id = req.params.id;
    user.array_personages[index].template = helper.template_image(user.array_personages[index].template_name)

    await user.save()


    res.redirect('/list_of_personages/' + req.session.userid)
})
// <-----------------------------> Delete Personage <----------------------------->

app.get('/delete_personage/:id', async (req, res) => {
    let user = await User.findOne({ _id: req.session.userid })
    for (let i = 0; i < user.array_personages.length; i++) {
        if (user.array_personages[i]._id == req.params.id) {
            user.array_personages.splice(i, 1);
            user.save();
        }
    }
    res.redirect('/')
})

// <-----------------------------> Before <----------------------------->

app.get('/before', async (req, res) => {
    res.render('./layout/before.html.twig', {
        url: '/before',
    })

})