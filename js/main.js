/*jslint white:true, plusplus:true, unparam:true, nomen:true, browser:true*/
/*global $, jQuery, alert, io*/
(function() {
    'use strict';
    var speedometro = {},
        S = speedometro;

    S.init = function() {
        var MAX_CRUMBS = 90,
            $crumbs = $('#crumbs > ul'),
            $crumb = $('<li><a href="#"></a></li>'),
            socket = io(),
            i;

        for (i = MAX_CRUMBS; i >= 0; i = i - 10) {
            $crumbs.append($crumb.clone()
                .find('a')
                .html('&nbsp;')
                .attr('title', (MAX_CRUMBS - i) + ' a ' + ((MAX_CRUMBS - i) + 10) + '%')
                .addClass(MAX_CRUMBS - i >= 50 ? 'disabled' : 'enabled')
                .end());
        }

        $crumbs.find('a:first')
            .addClass('first')
            .text('Uh?');

        $crumbs.find('a:last')
            .addClass('last')
            .text('Run Forest, Run!');

        $('a.plus, a.minus')
            .on('click', function() {
                socket.emit($(this)
                    .hasClass('plus') ? 'plus' : 'minus');
                return false;
            });

        socket.on('refresh', function(data) {
            S.update(data);
            $('#users').text(data.persons);
        });

        socket.on('maxvalue', function(data) {
            alert('Parabéns! Você usou todos os "+" disponíveis!');
        });

        socket.on('minvalue', function(data) {
            alert('Desculpe, você não pode negativar mais.');
        });

        socket.on('mylifes', function(data) {
            $('#lifes')
                .text(data);
        });

        socket.emit('getData');
    };

    S.update = function(data) {
        var max = data.persons * 3,
            progress = Math.round(data.plus / max * 10);

        $('#crumbs > ul > li > a')
            .addClass('disabled')
            .removeClass('enabled')
            .filter(':lt(' + progress + ')')
            .addClass('enabled');
    };

    $(function() {
        S.init();
    });
}());