var STSE = {
  numOfResults: 500
};

function getJSON(url, callback, opts){
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function(){
    if(ajax.readyState === 4 && ajax.status === 200){
      var r = ajax.response;
      callback(r, opts);
    }
  };

  ajax.open('GET', url, !0);
  ajax.send();
}

STSE.renderNewPage = function(markup) {
  this.d.open();
  this.d.write(markup);
  this.d.close();
}

STSE.bindClicks = function() {
  var target,
      self = this;

  self.d.querySelector('.content .dbody').addEventListener('click', function(e){
    target = e.target;

    if (target.href && (target.href.indexOf('search_string')+1)) {
      target.parentNode.parentNode.style.opacity = 0.25;
    }
  });
}

STSE.filterResults = function() {
  var posts, titles, post, posttitle,
      self = this;

  titles = [];
  posts = self.d.querySelectorAll('.dcell.subject > a');

  for (var i = 0; i < posts.length; i++) {
    post = posts[i];
    posttitle = post.innerHTML.split(' [')[0];

    if (titles.indexOf(posttitle)+1 || post.innerHTML.indexOf('Re: ')+1) {
      post.parentNode.parentNode.style.display = 'none';
    } else {
      titles.push(posttitle);
    }
  }
}

STSE.init = function(doc, win) {

  var self = this;

  self.d = doc;
  self.w = win;

  if ((self.w.location.href.indexOf('do=search_results') + 1)) {
    self.filterResults();
    self.bindClicks();
  }

  // manual redirect to page if forward/back buttons are hit
  self.w.addEventListener('popstate', function(e) {
    self.w.location.href = e.target.window.location.href;
  });

  var searchUrl, searchBox, newSearchBox;
  if ((searchBox = self.d.querySelector('.searchbox input[type="text"]'))) {

    newSearchBox = searchBox.cloneNode(1);
    newSearchBox.placeholder = 'Enhanced Search';
    searchBox.parentNode.replaceChild(newSearchBox, searchBox);

    newSearchBox.addEventListener('keydown', function(e) {
      if (e.keyCode === 13) {
        e.target.blur();
        e.preventDefault();
        self.d.body.style.webkitFilter = 'blur(3px)';
        searchUrl = 'http://forum.slowtwitch.com/forum/?do=search_results&search_forum=forum_2&search_string=' + e.target.value + '&search_type=AND&search_fields=sb&search_time=&search_user_username=&group=yes&sb=post_time&mh=' + self.numOfResults;
        getJSON(searchUrl, function(r){
          self.renderNewPage(r);

          history.pushState(null,null, searchUrl);

          setTimeout(function(){
            self.init(document, window);
          },200);

        });
      }
    });
  }
}

STSE.init(document, window);