Using wordlist from SCOWL (https://github.com/en-wl/wordlist)

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
