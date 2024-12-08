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

First, you will need a newline-delimited word list named `wl.txt` in the same
directory as the code. See the section below on the method I used to generate my
word list.

Next, you'll need to install Deno. Do it, it's great. Then you can run the task
with any command-line arguments you want for various purposes:

```shell
# check if a word is in your word list
$ deno task run --checkword=antiquark

# tells you how many possible words you could use as the first word of a 2-word solution
$ deno task run --letters=abc,def,ghi,jkl --howhard

# tells you the letters you can start the first word with
$ deno task run --letters=abc,def,ghi,jkl --hint1=1

# tells you the 2-letter bigrams you can start the second word with
$ deno task run --letters=abc,def,ghi,jkl --hint2=2

# get 20 candidate words containing certain letters (combine the "must" flags for fun and profit)
$ deno task run --letters=abc,def,ghi,jkl --candidates --must-have=jk
$ deno task run --letters=abc,def,ghi,jkl --candidates --must-start=a
$ deno task run --letters=abc,def,ghi,jkl --candidates --must-end=b

# tells you the possible 2-word solutions
$ deno task run --letters=abc,def,ghi,jkl --answer
```

## Word List

Do note that I'm not using the official word list used by NYT, which is
proprietary. In fact the word list I'm using isn't even in the repo.

I used a wordlist sourced from SCOWL (https://github.com/en-wl/wordlist).

Clone SCOWL, run `make`, then run a command like the following to get a base
wordlist:

```shell
./scowl word-list scowl.db \
--deaccent --categories '' \
--wo-poses abbr --apostrophe False \
--wo-pos-categories nonword,special,wordpart \
--nosuggest  > ../wl.txt
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
> wl.txt
```
