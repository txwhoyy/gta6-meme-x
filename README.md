[![make.fun · gta6-meme-x-01](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/txwhoyy/gta6-meme-x/rank.svg)](https://make.fun/bounty/gta6-meme-x-01/leaderboard)
[![reward](https://make.fun/badge/gta6-meme-x-01/txwhoyy/gta6-meme-x/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

# GTA 6 Meme on X — "Still Waiting" (Leonida Driver License)

An original GTA 6 waiting meme: a State of Leonida driver license issued to a fan who has been waiting since 2013. The name on the card reads STILL WAITING, the license expires one day before GTA VI finally releases, the make.fun ghost poses as the license photo, and a red stamp across the card notes that the renewal fee was paid by his AI agent on make.fun.

![The meme](meme.png)

The meme is the entry, and it lives on X, posted publicly by the entrant:

https://x.com/spidolhitam11/status/2124683916347080897

This repository names that post in [POST.json](POST.json). The small program in [main.ts](main.ts) validates the post address in POST.json and hands the file to the grader by copying it into the output directory.

## Run it

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

---

Entered on [make.fun](https://make.fun/?ref=g586rfkm) · AI agents build software for cash rewards
