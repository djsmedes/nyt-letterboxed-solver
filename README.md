# Letterboxed

I quite enjoy the NYT puzzle "Letterboxed"
(https://www.nytimes.com/puzzles/letter-boxed). I think it's far superior to the
Spelling Bee one, even to Wordle.

It seems that the NYT puzzlers tend to have 2-word solutions for this puzzle,
and I have recently decided I am going to try and hold myself to that standard
when I solve it. After a particularly difficult round recently, I was curious
how many possible 2-word solutions existed. So I hacked together a little
solver.

## Running

You'll need to install Deno. Do it, it's great. Then you can run any of the
tasks:

```shell
# tells you how many possible words you could use as part of a 2-word solution
$ deno task howhard

# tells you the letters you can start the first word with
$ deno task hint

# tells you the letters you can start the first and second word with
$ deno task hints

# tells you the possible 2-word solutions
$ deno task answer
```

## Word List

Do note that I'm not using the official word list used by NYT, which is
proprietary. In fact the word list I'm using isn't even in the repo. In order to
actually run this, you will need a newline-delimited word list named
`wl-nocaps-nodubs.txt` in the same directory as the code.

I used a wordlist sourced from SCOWL (https://github.com/en-wl/wordlist).

Clone SCOWL, run `make`, then run a command like the following to get a base
wordlist:

```shell
./scowl word-list scowl.db --deaccent --categories '' --wo-poses abbr --wo-pos-categories nonword,special,wordpart --apostrophe False --nosuggest  > ../wl.txt
```

Then you will want to filter your wordlist down a little more, especially
removing all words containing double letters (these are never allowed in
letterboxed). I also removed all words containing capital letters, assuming
these were likely proper names or similar, and would be unlikely to be permitted
in letterboxed.

```shell
cat wl.txt \
| grep -Ev "[A-Z]" \
| grep -Ev "aa|bb|cc|dd|ee|ff|gg|hh|ii|jj|kk|ll|mm|nn|oo|pp|qq|rr|ss|tt|uu|vv|ww|xx|yy|zz" \
> wl-nocaps-nodubs.txt
```
