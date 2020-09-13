# Annotate Chinese with Pinyin

Chrome extension for annotating Chinese with Pinyin.

[![Available in the Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/annotate-chinese-with-pin/nklndoamigakcadfpngfkcppjpijcghj?hl=en)
[![Get the Add-On for Firefox](https://ffp4g1ylyit3jdyti1hqcvtb-wpengine.netdna-ssl.com/addons/files/2015/11/get-the-addon.png)](https://addons.mozilla.org/en-US/firefox/addon/annotate-chinese-with-pinyin/)

![Demo](https://user-images.githubusercontent.com/351715/93007452-48b43f00-f537-11ea-9b4e-1d13659d598f.gif)

## Build

* `npm run unihan`: To download the [Unihan data files](https://unicode.org/charts/unihan.html).
* `npm run build`: generates the extension in `build` directory that can be loaded for testing
* `npm run build:zip`: packages the extension in `build.zip` for publishing

## Data

This extension uses Unicode Data Files. Please see https://www.unicode.org/copyright.html for licensing details.
