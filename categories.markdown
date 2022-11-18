---
layout: page
title: Categories
permalink: /categories/
---

{% assign categories_list = site.categories %}
{% for category in categories_list %}
<h3 id="{{ category[0] }}-ref">{{ category[0] | join: "/" | capitalize | replace: '-', ' ' }}</h3>
<ul>
  {% assign pages_list = category[1] %}
  {% for node in pages_list %}
    {% if node.title != null %}
      {% if group == null or group == node.group %}
        {% if page.url == node.url %}
<li class="active"><a href="{{ BASE_PATH }}{{node.url}}" class="active">{{node.title}}</a></li>
        {% else %}
<li><a href="{{ BASE_PATH }}{{node.url}}">{{node.title | replace:'<br/>',' '}}</a></li>
        {% endif %}
      {% endif %}
    {% endif %}
  {% endfor %}
</ul>
{% endfor %}
