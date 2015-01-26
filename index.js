(function(d, w){

  var numOfResults = 200;

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


  var posts, titles, post, posttitle;
  function filterResults() {
    titles = [];
    posts = document.querySelectorAll('a[href*="gforum.cgi?post="]');

    for (var i = 0; i < posts.length; i++) {
      post = posts[i];
      posttitle = post.innerHTML.split(' [')[0];

      post.addEventListener('click', function(e){
        e.preventDefault();
        window.open(e.target.href);
        e.target.parentNode.parentNode.parentNode.style.opacity = 0.25;
      })

      if (titles.indexOf(posttitle) !== -1 || posttitle.match('Re: ')) {
        post.parentNode.parentNode.parentNode.style.display = 'none';
      } else {
        titles.push(posttitle);
      }
    }
  }


  function init() {
    var i, len, searchForms, form;
    for (i = 0, searchForms = document.querySelectorAll('form[action="gforum.cgi"]'), len = searchForms.length; i < len; i++) {
      form = searchForms[i];
      if (form.querySelector('input[type="text"]')) {
        form.addEventListener('submit',function(e){
          e.preventDefault();
        });
      }
    }

    var searchUrl, searchBox, newSearchBox;
    if ((searchBox = document.querySelector('#searchbox') || document.querySelector('#query'))) {

      newSearchBox = searchBox.cloneNode(1);
      newSearchBox.placeholder = 'Enhanced Search';

      newSearchBox.addEventListener('keydown', function(e) {
        if (e.keyCode === 13) {
          document.body.style.opacity = 0.25;
          searchUrl = 'http://forum.slowtwitch.com/gforum.cgi?do=search_results&search_forum=forum_2&search_string=' + e.target.value + '&search_type=AND&search_fields=sb&search_time=&search_user_username=&sb=post_time&mh=' + numOfResults;
          getJSON(searchUrl, function(r){
            renderNewPage(r)

            history.pushState({},'st search', searchUrl);

            setTimeout(function(){
              filterResults();
            },200);

          });
        }
      });

      searchBox.parentNode.replaceChild(newSearchBox, searchBox);
    }
  }


  init();

}(document,window));