---
layout: page
title: dragonwasrobot
tagline: <br/>Will manipulate state machines for food
---
{% include JB/setup %}

*There are different rules for reading,*<br/>
*for thinking, and for talking.*<br/>
*Writing blends all three of them.*<br/>
-- Mason Cooley

{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
  <h3 id="{{ category[0] }}-ref">{{ category[0] | join: "/" | capitalize | replace: '-', ' ' }}</h3>

  <ul>
  {% for posts in category %}
    {% for post in posts %}
      {% if post.title != null %}
      <li>
        {{ post.date | date: "%-d %B, %Y" }}:
        <a href="{{ post.url }}">{{ post.title | replace: '<br/>', ' ' }}</a>
        <p>{{ post.description }}</p>
      </li>
      {% endif %}
    {% endfor %}
  {% endfor %}
  </ul>
{% endfor %}
