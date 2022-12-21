# setup-ccache
Github Action to install ccache

## Supported OSes

* macOS
* Ubuntu (or other dpkg-based distros)

Windows / rpm-based distros are **not** supported. (PRs to improve this situation welcome.)

## Example

```yaml
      - name: Cache compilation
        uses: actions/cache@v1
        with:
          path: ~/.cache/ccache # on mac: ~/Library/Caches/ccache
          key: ccache
      - name: Setup ccache
        uses: alexjurkiewicz/setup-ccache@master
        with:
          max-size: 150M
          extra-config: |
            keep_comments_cpp = true
      - name: Compile program
        run: make all
```

Default ccache config is:

```
compression = true
compression_level = 9
log_file = /tmp/ccache.log
```

## Input options

* `max-size` Set the maximum size of the ccache directory
* `extra-config` Extra config that will be appended to `~/.ccache/ccache.conf`

## Contributing

1. Make your change to `src/setup-ccache.ts`
2. Run `npm run-script build`
3. Submit a pull request
