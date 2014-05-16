---
---
var docs =
[
{% for post in site.posts %}
  {% include post.json %},
{% endfor %}
];

// init lunr
var idx = lunr(function () {
  this.field('title', {boost: 10});
  this.field('content');
})

for(var index in docs)
{
  idx.add(docs[index]);
}

$(function() {
  $("#search-input").on("change paste keyup", function(e) {
    value = $(this).val();
    if (value.length > 1){
      search(value);
    }
  })
})

function get_doc(ref)
{
  for (var i = docs.length - 1; i >= 0; i--) {
    if( docs[i].id == ref)
      return docs[i];
  };
  return undefined;
}

function search(value) {
  var result = idx.search(value);

  $("div.find-results-dialog").removeAttr("style");
  var find_results = $("div.find-results");
  find_results.removeData();
  find_results.html("<h1>Find Results</h1>")
  if (result.length === 0)
  {
    find_results.html(find_results.html() + "No Result.");
  }
  for (var i = 0; i < result.length; i++) {
    var doc = get_doc(result[i].ref);
    template = $("div.find-result-template");
    var item = template.clone();
    find_results.append(item);
    item.find('.find-date').html(doc["date"]+"&nbsp;-&nbsp;");
    item.find('.find-title').html(doc["title"]);
    item.find('.find-title').attr('href', doc['ref']);
    item.attr('class', 'find-result');
    item.removeAttr('style');
  };
}
