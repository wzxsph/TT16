#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 2 ]]; then
  echo "usage: tt16-release <release-id> <archive-path>" >&2
  exit 64
fi

release_id="$1"
archive_path="$2"
release_root="/srv/tt16/releases"
target_path="${release_root}/${release_id}"
next_link="/srv/tt16/current-next"

if [[ ! "$release_id" =~ ^[0-9a-f]{7,40}$ ]]; then
  echo "release id must be a Git commit SHA" >&2
  exit 65
fi
expected_archive="/srv/tt16/incoming/${release_id}.tar.gz"
if [[ "$archive_path" != "$expected_archive" || -L "$archive_path" ]]; then
  echo "archive path must be the non-symlinked incoming file for this release" >&2
  exit 66
fi
if [[ ! -f "$archive_path" ]]; then
  echo "release archive does not exist: $archive_path" >&2
  exit 67
fi
if [[ -e "$target_path" ]]; then
  echo "release already exists: $target_path" >&2
  exit 68
fi

install -d -m 0755 "$release_root"
install -d -m 0755 "$target_path"
tar --extract --gzip --file "$archive_path" --directory "$target_path" --no-same-owner --no-same-permissions

test -f "${target_path}/index.html"
test -f "${target_path}/sitemap.xml"
test -d "${target_path}/assets"

ln -s "$target_path" "$next_link"
mv -Tf "$next_link" /srv/tt16/current
rm -f "$archive_path"

echo "TT16 release activated: $release_id"
