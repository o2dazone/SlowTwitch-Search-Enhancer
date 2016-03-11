(function(d, w){

  // gets total number of results, before filter
  var numOfResults = 500;

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

  function renderNewPage(markup) {
    document.open();
    document.write(markup);
    document.close();
  }

  function clickLink(post) {
    post.addEventListener('click', function(e){
      e.target.parentNode.parentNode.parentNode.style.opacity = 0.25;
    });
  }

  var posts, titles, post, posttitle;
  function filterResults() {
    titles = [];
    posts = document.querySelectorAll('.dcell.subject > a');

    for (var i = 0; i < posts.length; i++) {
      post = posts[i];
      posttitle = post.innerHTML.split(' [')[0];

      clickLink(post);

      if ((titles.indexOf(posttitle) !== -1) || !post.innerHTML.indexOf('Re: ')) {
        post.parentNode.parentNode.style.display = 'none';
      } else {
        titles.push(posttitle);
      }
    }
  }

  function init() {
    if (window.location.href.indexOf('do=search_results'))
      filterResults();

    // manual redirect to page if forward/back buttons are hit
    window.addEventListener('popstate', function(e) {
      window.location.href = e.target.window.location.href;
    });

    var searchUrl, searchBox, newSearchBox;
    if ((searchBox = document.querySelector('.searchbox input[type="text"]'))) {

      newSearchBox = searchBox.cloneNode(1);
      newSearchBox.placeholder = 'Enhanced Search';
      searchBox.parentNode.replaceChild(newSearchBox, searchBox);

      newSearchBox.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
          e.target.blur();
          e.preventDefault();
          document.body.style.webkitFilter = 'blur(3px)';
          searchUrl = 'http://forum.slowtwitch.com/forum/?do=search_results&search_forum=forum_2&search_string=' + e.target.value + '&search_type=AND&search_fields=sb&search_time=&search_user_username=&group=yes&sb=post_time&mh=' + numOfResults;
          getJSON(searchUrl, function(r){
            renderNewPage(r);

            history.pushState(null,null, searchUrl);

            setTimeout(function(){
              init();
            },200);

          });
        }
      });
    }
  }


  init();

}(document,window));