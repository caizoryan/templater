import {compile_file} from "./main.js"

let slug = "list-are-na-api-possibilities"
let channel 

let get_channel = (slug) => fetch("https://api.are.na/v2/channels/" + slug.trim())
		.then((res) => res.json())
		.then((res) => channel = res)
		.then((res) => run())

get_channel(slug)

let textarea = document.querySelector("textarea")

let loadbtn = document.querySelector("#load-btn")
let linkinput = document.querySelector("#link-input")
loadbtn.onclick = () => get_channel(linkinput.value.trim())

let runbtn = document.querySelector("#run-btn")
runbtn.onclick = () => run()

let iframe = document.querySelector("iframe")
let code = `
%%let tags = false; %%

<style>
* {font-family: sans-serif;} 
.block {border: 1px solid #444; padding: 2em;margin:1em;} 
.tag {background: yellow; font-size: .8em;}
</style>

<h1>
  %%if (tags)%% <span class='tag'>channel.id</span>
  %%+channel.title%%
</h1> 

%% for (let block of channel.contents){ %%
 
 <div class="block">

   <h4>
    %%if (tags)%% <span class='tag'>block.id</span>
    #%%+block.id%%
   </h4> 

   %%if (block.class == "Text") {%%
     %%+block.content_html%%
   %% } %%
  </div>


%% } %%
`
textarea.value = code
textarea.onkeydown = (e) => {
		if (e.key == "Enter" && (e.metaKey || e.altKey || e.ctrlKey) ) {
			run()
		}
}

function run(){
	code = textarea.value
	iframe.srcdoc = compile_file(`
	%% let channel = ${JSON.stringify(channel)}; %%

	${code}
	`)
}



