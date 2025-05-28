import {compile_file} from "./main.js"

let slug = "list-are-na-api-possibilities"
let channel 

let get_channel = (slug) => fetch("https://api.are.na/v2/channels/" + slug.trim() + "?per=100")
		.then((res) => res.json())
		.then((res) => channel = res)
		.then((res) => run())

get_channel(slug)

let textarea = document.querySelector("textarea")

let loadbtn = document.querySelector("#load-btn")
let savebtn = document.querySelector("#save-btn")
savebtn.onclick = () => {
	run()
	localStorage.setItem("input.html", code)
}

let linkinput = document.querySelector("#link-input")
loadbtn.onclick = () => get_channel(linkinput.value.trim())

let runbtn = document.querySelector("#run-btn")
runbtn.onclick = () => run()



let iframe = document.querySelector("iframe")
let code = `
%%let tags = false; %%

<style>
* {font-family: sans-serif;} 
body {display: flex; flex-direction: column-reverse;
.block {border: 1px solid #444; padding: 2em;margin:1em;} 
.tag {background: yellow; font-size: .8em;}
img {max-width: 80%;max-height: 80%}
</style>

<h1>
  %%if (tags)%% <span class='tag'>channel.id</span>
  %%+channel.title%%
</h1> 

%% for (let block of channel.contents){ %%
 
 <div class="block">
   <span>%%+block.class%%</span>
   <h4>
    %%if (tags)%% <span class='tag'>block.id</span>
    %%+block.id%%
   </h4> 


   %%if (block.class == "Text") {%%
     %%+block.content_html%%
   %% } %%
   
  %%if (block.class == "Image") {%%
    <img src="%%+block.image.display.url%%"></img>
   %% } %%

  %%if (block.class == "Link") {%%
    <img src="%%+block.image.display.url%%"></img>
    <a href="%%+block.source.url%%">
      <p>%%+block.source.url%%</p>
    </a>
   %% } %%
  </div>


%% } %%
`

let _code = localStorage.getItem("input.html")
if (_code) code = _code

textarea.value = code
textarea.onkeydown = (e) => {
	if (e.key == "Enter" && (e.metaKey || e.altKey || e.ctrlKey) ) {
		run()
	}
	if (e.key == 'Tab') {
			e.preventDefault();
			let start = textarea.selectionStart;
			let end = textarea.selectionEnd;

			// set textarea value to: text before caret + tab + text after caret
			textarea.value = textarea.value.substring(0, start) +
				"\t" + textarea.value.substring(end);

			// put caret at right position again
			textarea.selectionStart =
			textarea.selectionEnd = start + 1;
		}
}

function run(){
	code = textarea.value
	iframe.srcdoc = compile_file(`
	%% let channel = ${JSON.stringify(channel)}; %%

	${code}
	`)
}



