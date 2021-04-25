(function ( $ ) {

    $.fn.jTimeline = function (options) {

        var settings = $.extend({
            resolution: 50000, // pixels per second
            minimumSpacing: 200, // minimum spacing between events
            step: 200, // scrolling (translateX) step size
            leftArrow: "&larr;", // character for left arrow
            rightArrow: "&rarr;", // character for right arrow
        }, options);

        return this.each(function () {

            var $timeline = $(this),
                timelineWidth = $timeline.width(),
                $eventsList = $timeline.find('.jtimeline-events'),
                $events = $eventsList.find('.jtimeline-event');

            $timeline
                .prepend('<div class="jtimeline-scroll-left"><div class="jtimeline-arrow">' + settings.leftArrow + '</div></div>')
                .append('<div class="jtimeline-scroll-right"><div class="jtimeline-arrow">' + settings.rightArrow + '</div></div>');

            var $scrollLeft = $timeline.find('.jtimeline-scroll-left'),
                $scrollRight = $timeline.find('.jtimeline-scroll-right');

            var start, end;

            $events.each(function () {
                var $event = $(this),
                    eventTimestamp = parseInt($event.data('timestamp')),
                    eventLabel = $event.html();

                if (typeof start === 'undefined' || eventTimestamp < start) {
                    start = eventTimestamp;
                }

                if (typeof end === 'undefined' || eventTimestamp > end) {
                    end = eventTimestamp;
                }

                $event
                    .html('')
                    .append('<div class="jtimeline-event-bullet"></div>')
                    .append('<div class="jtimeline-event-label">' + eventLabel + '</div>');
            });

            if (typeof start === 'number' && typeof end === 'number') {

                var length = end - start,
                    width = length / settings.resolution;

                $eventsList.css('width', width + 'px');

                var initialX = 0,
                    prevEventTimestamp,
                    prevEventPosition,
                    cumulativeSpacing = 0;

                $events.each(function () {
                    var $event = $(this),
                        isActive = $event.hasClass('is-active'),
                        eventWidth = $event.width(),
                        eventTimestamp = parseInt($event.data('timestamp')),
                        timeOffset = eventTimestamp - start,
                        position = timeOffset / settings.resolution - eventWidth / 2 + cumulativeSpacing;

                    if (typeof prevEventPosition === 'number' && typeof prevEventTimestamp === 'number') {
                        if (prevEventTimestamp !== eventTimestamp) {
                            var distanceFromPrev = position - prevEventPosition;

                            if (distanceFromPrev < settings.minimumSpacing) {
                                var missingSpace = settings.minimumSpacing - distanceFromPrev;

                                position = prevEventPosition + settings.minimumSpacing;
                                cumulativeSpacing += missingSpace;
                            }
                        }
                    }

                    $event.css('left', position + 'px');

                    prevEventTimestamp = eventTimestamp;
                    prevEventPosition = position;

                    if (isActive) {
                        if (position > timelineWidth) {
                            initialX = timelineWidth - position - timelineWidth / 2 - eventWidth / 2;
                        }
                    }
                });

                width += cumulativeSpacing;
                $eventsList.css('width', width + 'px');

                var hidden = width - timelineWidth,
                    minX = - hidden;

                if (initialX < minX) {
                    initialX = minX;
                }

                $eventsList.on('jtimeline:translate', function (e, x) {
                    if (typeof x === 'number') {
                        $eventsList.css('transform', 'translate(' + x + 'px, 0)');

                        $scrollLeft.removeClass('is-disabled');
                        $scrollRight.removeClass('is-disabled');

                        if (x === 0) {
                            $scrollLeft.addClass('is-disabled');
                        } else if (typeof minX === 'number' && x === minX) {
                            $scrollRight.addClass('is-disabled');
                        }
                    }
                });

                $eventsList.trigger('jtimeline:translate', [initialX]);

                $scrollLeft.on('click', function (e) {
                    e.preventDefault();

                    var transform = $eventsList.css('transform'),
                        currentX = transform === 'none' ? 0 : parseInt(transform.split(/[()]/)[1].split(', ')[4]),
                        newX = currentX + settings.step;

                    if (newX > 0) {
                        newX = 0;
                    }

                    $eventsList.trigger('jtimeline:translate', [newX]);
                });

                $scrollRight.on('click', function (e) {
                    e.preventDefault();

                    var transform = $eventsList.css('transform'),
                        currentX = transform === 'none' ? 0 : parseInt(transform.split(/[()]/)[1].split(', ')[4]),
                        newX = currentX - settings.step;

                    if (newX < minX) {
                        newX = minX;
                    }

                    $eventsList.trigger('jtimeline:translate', [newX]);
                });

            }

        });

    };

}( jQuery ));
