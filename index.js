
// const { clientId, guildId, token, publicKey } = require('./config.json');
require('dotenv').config()

const { request } = require('undici');
const pastelgate = require('./pastelgate')
const pref_web = require('./api')
const cool = require('./db_m')
const { APPLICATION_ID, TOKEN, PUBLIC_KEY } = process.env
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("charming-jade-dholeCyclicDB")
const notes = db.collection("notes")

const robux = db.collection("bobux")

const pref = db.collection("pref")

const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');

const app = express();
// app.use(bodyParser.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', "./public")
const discord_api = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
	"Access-Control-Allow-Headers": "Authorization",
	"Authorization": `Bot ${TOKEN}`
  }
});
app.post('/interactions', verifyKeyMiddleware(PUBLIC_KEY), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    // console.log(interaction.data.name)
    if(interaction.data.name == 'yo'){
	    let leo = await notes.set(interaction.member.user.id, {
type: interaction.data.options[0].value
})

// get an item at key "leo" from collection animals
let item = await notes.get(interaction.member.user.id)

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: item.props.type
      }});
    }
    if (interaction.data.name == 'forms'){
	    return res.send({
	     type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
	     data: {
		     "content": "A form has appeared",
		     "tts": false,
		     "components": [
        {
            "type": 1,
            "components": [
                {
                    "type": 2,
                    "label": "Open " + interaction.data.options[0].value,
                    "style": 1,
                    "custom_id": "form_button"
                }
            ]

        }
    ]
	     }
	    })
    }
    if(interaction.data.name == 'help'){
      const message = await notes.get("0")
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
  "content": "",
  "tts": false,
  "embeds": [
    {
      "type": "rich",
      "title": `? kakll Help (0.1.4 (Beta) Forms Update) ?`,
      "description": `<b>akll bot comands and programs</b>\n${message.props.message}`,
      "color": 0x00FFFF,
      "fields": [
        {
          "name": `/dm`,
          "value": ` - Sends you a DM`,
          "inline": true
        },
	      {
          "name": `/yo`,
          "value": ` - Store your secret note`,
          "inline": true
        },{
          "name": `/bobux`,
          "value": ` - 100% legit free robux no joke guys`,
          "inline": true
        },{
	  "name": `/forms`,
          "value": ` - Creates a form for people to use and send results to a channel`,
          "inline": true
	}
      ],
      "footer": {
        "text": `akll bot is made by syntax7311`
      }
    }
  ]
        },
      });
    }
	  /* if(interaction.data.name == 'note'){
		  return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
  "content": interaction.member.user.name
	}
	  })
	  } */
    if(interaction.data.name == 'bobux'){
	    amount = ["50", "100", "250", "500", "1000"];

function whosPaying(amount) {
    let upperBound = names.length;
    let PersonBuyingLunch = Math.floor(Math.random() * upperBound)
    return names[PersonBuyingLunch] 
}
	    let item = await robux.get(interaction.member.user.id) ?? 0
	    let hey = whosPaying(amount)
	    let result = item + hey
	    let leo = await robux.set(interaction.member.user.id, {
bobux: result
})

// get an item at key "leo" from collection animals
item = await robux.get(interaction.member.user.id)
	    res.send({ 
		    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
		    data: {
                       content: item.props.bobux
                    }
	})
    }
    if(interaction.data.name == 'dm'){
      // https://discord.com/developers/docs/resources/user#create-dm
      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: interaction.member.user.id
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'Yo! I got your slash command. I am not able to respond to DMs just slash commands.',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }
      if(interaction.data.name == 'dmo'){
	      let c = (await discord_api.post(`/users/@me/channels`,{
        recipient_id: 716484322290565170
      })).data
      try{
        // https://discord.com/developers/docs/resources/channel#create-message
        let res = await discord_api.post(`/channels/${c.id}/messages`,{
          content:'DM',
        })
        console.log(res.data)
      }catch(e){
        console.log(e)
      }
      }

      return res.send({
        // https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data:{
          content:'👍'
        }
      });
    }
  }

});



app.get('/register_commands', async (req,res) =>{
  let slash_commands = [
    {
      "name": "yo",
      "description": "replies with Yo!",
      "type": 1,
      "options": [{
            "name": "paste",
            "description": "store a text in this bot",
            "type": 1,
            "required": true,
            
        },{
            "name": "method",
            "description": "post or get",
            "type": 1,
            "required": true,
            
        }
]
    },
	  {
      "name": "game",
      "description": "play a game",
      "options": []
    },
    {
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    },
	  {
      "name": "dmo",
      "description": "sends user a DM",
      "options": []
    }, {
      "name": "help",
      "description": "comands",
      "options": []
    }, {
      "name": "bobux",
      "description": "earn bobux",
      "options": []
    },{
      "name": "forms",
      "description": "creates a form and sends to channel",
      "type": 1,
      "options": [{
            "name": "formname",
            "description": "name of the form",
            "type": 1,
            "required": true,
            
        }
]
    }
	  /*{
      "name": "settings",
      "description": "OWNER ONLY",
      "options": [
	      {
            "name": "type",
            "description": "Type of settings",
            "type": 3,
            "required": true,
        }
      ]
    } */
  ]
  try
  {
    // api docs - https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    let discord_response = await discord_api.put(
      `/applications/${APPLICATION_ID}/commands`,
      slash_commands
    )
    console.log(discord_response.data)
    return res.send('commands have been registered')
  }catch(e){
    console.error(e.code)
    console.error(e.response?.data)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req,res) =>{
  console.log(req.cookies)
  if (req.cookies.access_key){
    try {
      const userResult = await request('https://discord.com/api/users/@me', {
    headers: {
      authorization: `Bearer ${req.cookies.access_key}`,
    },
  });
  const e2 = await userResult.body.json()
 /* const servers = await request("https://discord.com/api/v6/users/@me/guilds", {
    headers: {
        authorization: "Bot " + process.env.TOKEN
    }
})
const e3 = await servers.body.json()
e3.array.forEach(element => {
  
}); */
     return res.render('index', {
      username: JSON.stringify(e2)
     })
    } catch(e) {
      console.error(e)
      return res.sendFile('/login.html', {'root': "./public"});
    }
    
    
  }else{
    return res.sendFile('/login.html', {'root': "./public"});
  }
  
})
app.get('/gates', async ({ query },res) =>{
  const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: process.env.APPLICATION_ID,
					client_secret: process.env.CLIENT_SECRET,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `https://aklll.cyclic.app/gates`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();
			console.log(oauthData);
      const userResult = await request('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${oauthData.token_type} ${oauthData.access_token}`,
    },
  });
  const e2 = await userResult.body.json()
  console.log(e2)
  return res.render("confirmation", {
    "username": e2.global_name,
    "key": oauthData.access_token
  })
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}
	}
  
	
})
app.get("/etask/panel", (req,res) => {require('./admin').ui(req,res)})
app.post("/etask/api", express.json(), (req,res) => {require('./admin').api(req,res)})
app.post("/api/guilds/:guild", express.json(), (req,res)=>{pref_web(pref, req,res)})

app.listen(8999, () => {

})

