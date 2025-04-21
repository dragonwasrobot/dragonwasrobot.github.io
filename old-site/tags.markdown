---
layout: page
title: Tags
permalink: /tags/
---

{% for tag in site.tags %}
<h3 id="{{ tag[0] }}-ref">{{ tag[0] }}</h3>
<ul>
{% assign pages_list = tag[1] %}
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
