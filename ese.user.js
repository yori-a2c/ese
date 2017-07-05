// ==UserScript==
// @name         Esa Search Extension
// @namespace    ese
// @version      0.2.0
// @description  Esa Search Extension makes advanced searching easy.
// @author       nalabjp
// @match        https://*.esa.io/*
// @require      https://cdn.rawgit.com/HubSpot/vex/v4.0.0/dist/js/vex.combined.min.js
// @resource     vexCSS https://cdn.rawgit.com/HubSpot/vex/v4.0.0/dist/css/vex.css
// @resource     vexTheme https://cdn.rawgit.com/HubSpot/vex/v4.0.0/dist/css/vex-theme-default.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';

    // Configuration for vex
    const vexCss = GM_getResourceText('vexCSS');
    const vexTheme = GM_getResourceText('vexTheme');
    GM_addStyle(vexCss);
    GM_addStyle(vexTheme);
    vex.defaultOptions.className = 'vex-theme-default';

    // Add ESE element after form element
    var form = $('form.navbar-form.navbar-sub__navbar-form');
    var ese = $('<i class="fa fa-search-plus" aria-hidden="true id="ese" style="font-size: 24px; margin-top: 17px; margin-left: 10px; color: rgba(0, 0, 0, 0.2)"></i>');
    form.after(ese);

    // vex dialog
    var dialog = [
        '<style>',
            '.vex-custom-container {',
                'margin-top: 20px;',
            '}',
            '.vex-custom-block {',
                'margin-top: 5px;',
                'margin-bottom: 5px;',
            '}',
            '.vex-custom-block input[type="radio"] {',
                'margin-left: 10px;',
                'margin-right: 10px;',
            '}',
            '.vex.vex-theme-default .vex-content .vex-dialog-message {',
                'font-weight: bold;',
                'font-size: 1.4em;',
            '}',
            '.vex.vex-theme-default .vex-content {',
                'background: #efede0;',
                'width: 600px;',
            '}',
            '.vex.vex-theme-default .vex-dialog-form .vex-dialog-input {',
                'height: 600px;',
                'overflow-y: auto;',
            '}',
            '.vex.vex-theme-default .vex-dialog-form .vex-dialog-input input[type="text"]:focus {',
                'outline: none;',
                '-moz-box-shadow: inset 0 0 0 2px #0a9b94;',
                '-webkit-box-shadow: inset 0 0 0 2px #0a9b94;',
                'box-shadow: inset 0 0 0 2px #0a9b94;',
            '}',
        '</style>',
        '<div class="vex-custom-container">',
            '<div class="vex-custom-block">',
                '<label>キーワード</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事名 or カテゴリ or 本文にkeywordを含むものを絞り込み"></i>' +
                '<input name="keyword" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>Star</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="自分がStarしている記事で絞り込み"></i><br />' +
                '<input value="true" name="stared" type="radio" id="stared_true" /><label for="stared_true">true</label>' +
                '<input value="false" name="stared" type="radio" id="stared_false" /><label for="stared_false">false</label>' +
                '<input value="none" name="stared" type="radio" id="stared_none" /><label for="stared_none">none</label>',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>Watch</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="自分がWatchしている記事で絞り込み"></i><br />' +
                '<input value="true" name="watched" type="radio" id="watched_true" /><label for="watched_true">true</label>' +
                '<input value="false" name="watched" type="radio" id="watched_false" /><label for="watched_false">false</label>' +
                '<input value="none" name="watched" type="radio" id="watched_none" /><label for="watched_none">none</label>',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>WIP</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事のwip状態で絞り込み"></i><br />' +
                '<input value="true" name="wip" type="radio" id="wip_true" /><label for="wip_true">true</label>' +
                '<input value="false" name="wip" type="radio" id="wip_false" /><label for="wip_false">false</label>' +
                '<input value="none" name="wip" type="radio" id="wip_none" /><label for="wip_none">none</label>',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>種類</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事の種類で絞り込み"></i><br />' +
                '<input value="stock" name="kind" type="radio" id="kind_stock" /><label for="kind_stock">stock</label>' +
                '<input value="flow" name="kind" type="radio" id="kind_flow" /><label for="kind_flow">flow</label>' +
                '<input value="none" name="kind" type="radio" id="kind_both" /><label for="kind_both">both</label>',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>カテゴリ(部分一致)</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="カテゴリ名にkeywordを含むものを絞り込み"></i>' +
                '<input name="category" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>カテゴリ(前方一致)</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="カテゴリ名がkeywordから始まるものを絞り込み"></i>' +
                '<input name="in" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>カテゴリ(完全一致)</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="カテゴリ名がkeywordであるものを絞り込み"></i>' +
                '<input name="on" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>タグ</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="tagタグが付いているものを絞り込み"></i>' +
                '<input name="tag" type="text" placeholder="tag" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>記事名</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事名にkeywordを含むものを絞り込み"></i>' +
                '<input name="title" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>記事本文</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事本文にkeywordを含むものを絞り込み"></i>' +
                '<input name="body" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>記事作成者</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事作成者のscreen_nameで絞り込み"></i>' +
                '<input name="user" type="text" placeholder="screen_name" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>コメント</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="コメント本文にkeywordが含まれる記事を絞り込み"></i>' +
                '<input name="comment" type="text" placeholder="keyword" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>Star数</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="Star数で記事を絞り込み（不等号[>, <, >=, <=]が使えます）"></i>' +
                '<input name="stars" type="text" placeholder="number" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>Watch数</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="Watch数で記事を絞り込み（不等号[>, <, >=, <=]が使えます）"></i>' +
                '<input name="watcheds" type="text" placeholder="number" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>コメント数</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="コメント数で記事を絞り込み（不等号[>, <, >=, <=]が使えます）"></i>' +
                '<input name="comments" type="text" placeholder="number" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>作成日</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="作成日で記事を絞り込み（不等号[>, <, >=, <=]が使えます）"></i>' +
                '<input name="created" type="text" placeholder="YYYY-MM-DD" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>更新日</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="更新日で記事を絞り込み（不等号[>, <, >=, <=]が使えます）"></i>' +
                '<input name="updated" type="text" placeholder="YYYY-MM-DD" />',
            '</div>',
            '<div class="vex-custom-block">',
                '<label>外部公開</label>&nbsp;<i class="fa fa-question-circle" aria-hidden="true" data-toggle="tooltip" data-placement="right" data-title="記事の外部公開状態で絞り込み"></i><br />' +
                '<input value="true" name="sharing" type="radio" id="sharing_true" /><label for="sharing_true">true</label>' +
                '<input value="false" name="sharing" type="radio" id="sharing_false" /><label for="sharing_false">false</label>' +
                '<input value="none" name="sharing" type="radio" id="sharing_none" /><label for="sharing_none">none</label>',
            '</div>',
        '</div>'
    ].join(' ');

    // vex callback function
    var submitting = function (data) {
        if (!data) return console.log('Cancelled');

        var conditions = [];
        Object.keys(data).forEach(function(key) {
            var val = this[key].trim();
            switch(key) {
                case 'wip':
                case 'kind':
                case 'stared':
                case 'watched':
                case 'sharing':
                    if (val === 'none') return;
                    conditions.push(key + ':' + val);
                    break;
                case 'keyword':
                    for(let w of val.split(' ').reverse()) {
                        conditions.unshift(w);
                    }
                    break;
                default:
                    for(let w of val.split(' ')) {
                        conditions.push(key + ':' + w);
                    }
            }
        }, data);
        console.log(conditions);

        $('#search_input').val(conditions.join(' '));
        form.submit();
    };

    // Register click event
    ese.click(function(){
        vex.dialog.open({
            message: 'Advanced Search',
            input: dialog,
            buttons: [
                $.extend({}, vex.dialog.buttons.YES, { className: 'btn btn-primary js-disable-on-uploading', text: 'Search' })
            ],
            callback: submitting
        });

        // Enable after the element that configured Bootstrap tooltip defined
        $('[data-toggle="tooltip"]').tooltip();
    });
})();
