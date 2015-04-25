---
layout: page
title: dragonwasrobot
tagline: Work in progress
---
{% include JB/setup %}

*This page is very much work in progress (as demonstrated by the lack of blog
 posts and proper layout) but this should hopefully change in the near future as
 I start to churn out content :)*

### Blog posts:

<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date: "%-d %B, %Y" }}:
      <a href="{{ post.url }}">{{ post.title }}</a>
      <p>{{ post.description }}</p>
    </li>
  {% endfor %}
</ul>
