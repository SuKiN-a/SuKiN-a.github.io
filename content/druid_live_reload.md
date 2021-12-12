+++
title = "Adding Live Reload To Druid"
date = 2021-12-11
+++

# Motive

[Druid](https://github.com/linebender/druid) is a rust native GUI toolkit which I was trying to make an app in. A major pain point for me was the long compile times, a single line change would take over a minute to compile, while switching my linker to [mold](https://github.com/rui314/mold) helped somewhat, it still lacked the tight feedback loop I needed. So I decided to make an interpreted domain specific language which could do simple mockups of apps which I could then rewrite in rust. I don't know if this is a conventional way to achieve this, but this is what I thought of first!.

# Design

The initial syntax was modeled after HTML, however, the syntax felt too distracting for me. So I opted for a simpler language.

```go
row {
    button { "+" }
    label { "Hello" }
    button { "-" }
} { centre }
```

It uses a simple readable syntax with this rough format

```go
widget_name { arguments } { options }
```

The language is then interpreted and whenever the source file is changed, the main widget is updated, leading to only a subsecond gap between saving code and seeing it reflected in the app!

# Current State

The entire system is currently a bodge, everything *works* but not very well, and the code is definitely not good enough to be made public. the parser is currently built with [LALRPOP](https://github.com/lalrpop/lalrpop) and I am using its built-in lexer, but it has been annoying for me to deal with. So I plan to switch to a lexer built with [logos](https://github.com/maciejhirsz/logos) soon.
The "Interpreter" is very much not workable, so it will also have to be rewritten. I have not been able to work on this project for quite a while because of school, however I plan to restart work on it in the near future.

**__Thanks for reading!__**