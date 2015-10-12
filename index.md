---
layout: page
title: dragonwasrobot
tagline: <br/>Will manipulate state machines for food
---
{% include JB/setup %}

I like to write code, I like to write words, so I started a blog:

*There are different rules for reading,*<br/>
*for thinking, and for talking.*<br/>
*Writing blends all three of them.*<br/>
-- Mason Cooley

### Blog posts
<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date: "%-d %B, %Y" }}:
      <a href="{{ post.url }}">{{ post.title | replace:'<br/>',' ' }}</a>
      <p>{{ post.description }}</p>
    </li>
  {% endfor %}
</ul>
