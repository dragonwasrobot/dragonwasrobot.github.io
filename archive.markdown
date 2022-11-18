---
layout: page
title : Archive
permalink: /archive/
---

{% for post in site.posts %}
  {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
  {% capture next_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}

  {% if forloop.first %}
### {{this_year}}
  {% endif %}

- <span>{{ post.date | date: "%B %e, %Y" }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title | replace:'<br/>',' ' }}</a>

  {% if forloop.last %}
  {% else %}
    {% if this_year != next_year %}
### {{next_year}}
    {% endif %}
  {% endif %}
{% endfor %}
