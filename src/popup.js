function putdata(json)
{ 

  $("#hot > li").remove();
  $("hr").remove();
  $("#hot").append("<hr>");
  for (var i = 0; i < parseInt(localStorage.maxCount);i++ ) {

    repo = json.items[i];

    if(parseInt(repo.stargazers_count)<parseInt(localStorage.starCutoff)){break;}
    
    var node = document.createElement("li");
    node.data = repo.html_url;

    var ownerNameText = document.createTextNode(repo.owner.login+'/');
    var ownerName = document.createElement("span");
    ownerName.className = "ownerName";
    ownerName.appendChild(ownerNameText);
    
    var repoNameText = document.createTextNode(repo.name);
    var repoName = document.createElement("span");
    repoName.className = "repoName";
    repoName.appendChild(repoNameText);
    
    var nameNode = document.createElement("span");
    nameNode.appendChild(ownerName);
    nameNode.appendChild(repoName);
    nameNode.data = repo.html_url;
    nameNode.className = "name";

    node.appendChild(nameNode);

    node.appendChild(document.createElement("br"));
    node.appendChild(document.createElement("br"));
    
    if(repo.description!=null){
      var descText = document.createTextNode(repo.description);
      var descNode = document.createElement("h5");
      descNode.appendChild(descText);
      descNode.className = "desc";
      node.appendChild(descNode);
      node.appendChild(document.createElement("br"));
      node.appendChild(document.createElement("br"));  
    }

    if(repo.language!=null)bottomText = repo.stargazers_count+' Stars  •  '+repo.language;
    else bottomText = repo.stargazers_count+' Stars';
    var starText = document.createTextNode(bottomText);
    var starNode = document.createElement("h5");
    starNode.appendChild(starText);
    starNode.className = "stars"
    node.appendChild(starNode);
    
    document.getElementById("hot").appendChild(node);
    document.getElementById("hot").appendChild(document.createElement("hr"));
  };

}

function fetchdata(){
  imgToggle();
  daysSinceCreation = parseInt(localStorage.daysSinceCreation);
  date = new Date(new Date().getTime()-daysSinceCreation*24*60*60*1000).toISOString().slice(0,10)
  req =  new XMLHttpRequest();
  req.open("GET",'https://api.github.com/search/repositories?q=created:%3E'+date+'&sort=stars&order=desc',true);
  req.send();
  req.onload = function(){
    imgToggle();
    
    now = (new Date()).getTime()/1000;
    localStorage.cache  = req.responseText;
    localStorage.time = now;
    
    res = JSON.parse(req.responseText);
    putdata(res);

  };
  req.onerror = function(){
    imgToggle();
  }

}

function imgToggle(){
  src = $('.loading').attr('src');
  if(src=="img/refresh-white.png") $(".loading").attr("src","img/ajax-loader.gif");
  else $(".loading").attr("src","img/refresh-white.png");
}

$(document).ready(function(){

  if(!localStorage.updateInterval)localStorage.updateInterval = "10";
  if(!localStorage.daysSinceCreation)localStorage.daysSinceCreation = "7";
  if(!localStorage.maxCount)localStorage.maxCount = "15";
  if(!localStorage.starCutoff)localStorage.starCutoff = "5";
  
  now = (new Date()).getTime()/1000;
  if(!localStorage.cache || now - parseInt(localStorage.time) > parseInt(localStorage.updateInterval)*60){
    // cache is old or not set
    fetchdata();
  }
  else{
    // cache is fresh
    putdata(JSON.parse(localStorage.cache));
    if(localStorage.scrollTop){
      document.body.scrollTop = localStorage.scrollTop;
    }
  }

  addEventListener('scroll', function(){
    localStorage.scrollTop = document.body.scrollTop;
  });

  $("body").on('click',".name", function(){
		chrome.tabs.create({url: this.data});
		return false;
	});

  $("body").on('click',"a", function(){
		chrome.tabs.create({url: $(this).attr('data')});
		return false;
   });
  
  $("body").on('click',".settings-btn", function(){
		chrome.tabs.create({url: "options.html"});
		return false;
  });

  $("body").on('click',".gh-btn", function(){
		chrome.tabs.create({url: "https://github.com/nishanthvijayan/GithubLatestProjects-Chrome/" });
  });

  $("body").on('click',".loading", function(){
    src = $('.loading').attr('src');
    if(src=="refresh-white.png") fetchdata();
  });

});