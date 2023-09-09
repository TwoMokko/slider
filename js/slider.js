"use strict";
class Slider {
    states = { 'years': 1, 'months': 2 };
    state;
    year_from;
    year_until;
    year_count;
    size;
    year_from_active;
    year_until_active;
    month_from_active;
    month_until_active;
    $switcher;
    $switch_years;
    $switch_months;
    $space;
    $wind_space;
    $slider_container;
    $wind_slider;
    $line_container;
    $line;
    $line_active;
    $touch_from;
    $touch_from_circle;
    $touch_until;
    $touch_until_circle;
    $window_from;
    $window_until;
    $dates_container;
    $dates_years;
    $dates_months;
    constructor(container, from_year, until_year, date_from, date_until) {
        this.year_from = from_year;
        this.year_until = until_year;
        this.year_from_active = date_from.getFullYear();
        this.year_until_active = date_until.getFullYear();
        this.month_from_active = date_from.getMonth();
        this.month_until_active = date_until.getMonth();
        if (from_year > until_year ||
            date_from > date_until ||
            from_year > this.year_from_active ||
            until_year < this.year_until_active) {
            container.append($('<div/>', { class: 'error', text: 'Неправильно введены данные' }));
            return;
        }
        this.state = this.states.years;
        this.year_count = this.year_until - this.year_from + 1;
        /* Elements */
        this.$switcher = $('<div/>', { class: 'switcher' });
        this.$switch_years = $('<span/>', { class: 'switch_years active', text: 'Все года' });
        this.$switch_months = $('<span/>', { class: 'switch_months inactive', text: 'Месяца' });
        this.$space = $('<div/>', { class: 'space' });
        this.$wind_space = $('<div/>', { class: 'wind_space' });
        this.$slider_container = $('<div/>', { class: 'slider_container' });
        this.$wind_slider = $('<div/>', { class: 'wind_slider' });
        this.$line_container = $('<div/>', { class: 'line_container' });
        this.$line = $('<div/>', { class: 'line' });
        this.$line_active = $('<div/>', { class: 'line_active' });
        this.$touch_from = $('<div/>', { class: 'touch_container' });
        this.$touch_from_circle = $('<div/>', { class: 'touch from' });
        this.$touch_until = $('<div/>', { class: 'touch_container' });
        this.$touch_until_circle = $('<div/>', { class: 'touch until' });
        this.$window_from = $('<div/>', { class: 'window from' });
        this.$window_until = $('<div/>', { class: 'window until' });
        this.$dates_container = $('<div/>', { class: 'dates_container' });
        this.$dates_years = $('<div/>', { class: 'dates years' });
        this.$dates_months = $('<div/>', { class: 'dates months hide' });
        /* Building DOM */
        container.append($('<div/>', { class: 'slider' }).append(this.$switcher.append($('<div/>').append(this.$switch_years), $('<div/>').append(this.$switch_months)), $('<div/>', { class: 'spaces' }).append(this.$space.append(this.$slider_container.append(this.$line_container.append(this.$line.append(this.$line_active, this.$touch_from.append(this.$touch_from_circle), this.$touch_until.append(this.$touch_until_circle))), this.$dates_container.append(this.$dates_years, this.$dates_months))), this.$wind_space.append(this.$wind_slider.append(this.$window_from.append($('<div/>'), $('<div/>')), this.$window_until.append($('<div/>'), $('<div/>')))))));
        /* Events */
        this.$switch_years.on('click', () => { this.DoSwitchYear(); this.PutInPlaceLine(); });
        this.$switch_months.on('click', () => { this.DoSwitchMonth(); this.PutInPlaceLine(); });
        this.$touch_from_circle.on('mousedown.slider', (e) => {
            let startX = e.pageX;
            let l = this.$touch_from.position().left;
            $(window).on('mousemove.slider', (e) => { this.MoveTouch('from', l + e.pageX - startX); });
            $(window).on('mouseup.slider', (e) => { $(window).off('mousemove.slider'); $(window).off('mouseup.slider'); });
        });
        this.$touch_until_circle.on('mousedown.slider', (e) => {
            let startX = e.pageX;
            let l = this.$touch_until.position().left;
            $(window).on('mousemove.slider', (e) => { this.MoveTouch('until', l + e.pageX - startX); });
            $(window).on('mouseup.slider', (e) => { $(window).off('mousemove.slider'); $(window).off('mouseup.slider'); });
        });
        this.$touch_from_circle.on('touchstart.slider', (e) => {
            let startX = e.touches[0].pageX;
            let l = this.$touch_from.position().left;
            $(window).on('touchmove.slider', (e) => { this.MoveTouch('from', l + e.touches[0].pageX - startX); });
            $(window).on('touchend.slider', (e) => { $(window).off('touchmove.slider'); $(window).off('touchend.slider'); });
        });
        this.$touch_until_circle.on('touchstart.slider', (e) => {
            let startX = e.touches[0].pageX;
            let l = this.$touch_until.position().left;
            $(window).on('touchmove.slider', (e) => { this.MoveTouch('until', l + e.touches[0].pageX - startX); });
            $(window).on('touchend.slider', (e) => { $(window).off('touchmove.slider'); $(window).off('touchend.slider'); });
        });
        this.$dates_years.on('mousedown.slider', (e) => {
            let startX = e.pageX;
            let l = this.$slider_container.position().left;
            $(window).on('mousemove.slider', (e) => { this.MoveYears(e, 'mousemove', startX, l); });
            $(window).on('mouseup.slider', (e) => { $(window).off('mousemove.slider'); $(window).off('mouseup.slider'); });
        });
        this.$dates_years.on('touchstart.slider', (e) => {
            let startX = e.touches[0].pageX;
            let l = this.$slider_container.position().left;
            $(window).on('touchmove.slider', (e) => { this.MoveYears(e, 'touchmove', startX, l); });
            $(window).on('touchend.slider', (e) => { $(window).off('touchmove.slider'); $(window).off('touchend.slider'); });
        });
        // this.$dates_years.on('wheel', (e) => { this.MoveYears(e, 'wheel'); });
        this.$dates_months.on('mousedown.slider', (e) => {
            let startX = e.pageX;
            let l = this.$slider_container.position().left;
            $(window).on('mousemove.slider', (e) => { this.MoveYears(e, 'mousemove', startX, l); });
            $(window).on('mouseup.slider', (e) => { $(window).off('mousemove.slider'); $(window).off('mouseup.slider'); });
        });
        this.$dates_months.on('touchstart.slider', (e) => {
            let startX = e.touches[0].pageX;
            let l = this.$slider_container.position().left;
            $(window).on('touchmove.slider', (e) => { this.MoveYears(e, 'touchmove', startX, l); });
            $(window).on('touchend.slider', (e) => { $(window).off('touchmove.slider'); $(window).off('touchend.slider'); });
        });
        // this.$dates_months.on('wheel', (e) => {});
        this.CreateSliderDates();
        this.RedrawYear();
        this.DrawLineForYear();
        this.ChangeDate();
        this.PutInPlaceLine();
        this.$wind_slider.width(this.$slider_container.width());
        $(window).on('resize', () => {
            this.RedrawYear();
            this.DrawLineForYear();
            let left = this.$slider_container.position().left;
            if ((this.$space.width() - left) > this.$slider_container.width())
                left = this.$space.width() - this.$slider_container.width();
            this.$slider_container.css('left', left);
            this.$wind_slider.css('left', left);
            if (this.$slider_container.position().left + this.$touch_from.position().left + 10 < 0)
                this.$window_from.css('left', -this.$slider_container.position().left);
            if (-this.$slider_container.position().left + this.$space.width() < this.$touch_until.position().left + 10)
                this.$window_until.css('left', -this.$slider_container.position().left + this.$space.width());
            if (this.$slider_container.position().left + this.$touch_from.position().left + 10 + this.$line_active.width() < 0)
                this.$window_until.css('left', -this.$slider_container.position().left);
            if (-this.$slider_container.position().left + this.$space.width() + this.$line_active.width() < this.$touch_until.position().left + 10)
                this.$window_from.css('left', -this.$slider_container.position().left + this.$space.width());
        });
    }
    CreateSliderDates() {
        let months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        for (let i = 0; i <= (this.year_until - this.year_from); i++) {
            this.$dates_years.append($('<span/>', { class: 'year', text: this.year_from + i }));
        }
        for (let i = this.year_from; i <= this.year_until; i++) {
            this.$dates_months.append($('<span/>', { class: 'month', text: i }));
            for (const month of months) {
                this.$dates_months.append($('<span/>', { class: 'month', text: month }));
            }
        }
        this.$dates_months.append($('<span/>', { class: 'month', text: this.year_until + 1 }));
    }
    PutInPlaceLine() {
        let left = this.$space.width() / 10 - this.$touch_from.position().left;
        if ((this.$touch_from.position().left - this.$slider_container.position().left) <= this.$space.width())
            left = 0;
        this.$slider_container.css('left', left);
        this.$wind_slider.css('left', left);
    }
    DoSwitchYear() {
        this.state = this.states.years;
        if (this.$switch_years.hasClass('active'))
            return;
        this.$switch_years.removeClass('inactive').addClass('active');
        this.$switch_months.removeClass('active').addClass('inactive');
        this.$dates_years.removeClass('hide');
        this.$dates_months.addClass('hide');
        this.RedrawYear();
        this.DrawLineForYear();
        this.PutInPlaceLine();
        this.$wind_slider.width(this.$slider_container.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 < 0)
            this.$window_from.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() < this.$touch_until.position().left + 10)
            this.$window_until.css('left', -this.$slider_container.position().left + this.$space.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 + this.$line_active.width() < 0)
            this.$window_until.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() + this.$line_active.width() < this.$touch_until.position().left + 10)
            this.$window_from.css('left', -this.$slider_container.position().left + this.$space.width());
    }
    DoSwitchMonth() {
        this.state = this.states.months;
        if (this.$switch_months.hasClass('active'))
            return;
        this.$switch_months.removeClass('inactive').addClass('active');
        this.$switch_years.removeClass('active').addClass('inactive');
        this.$dates_months.removeClass('hide');
        this.$dates_years.addClass('hide');
        this.RedrawMonth();
        this.DrawLineForMonth();
        this.PutInPlaceLine();
        this.$wind_slider.width(this.$slider_container.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 < 0)
            this.$window_from.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() < this.$touch_until.position().left + 10)
            this.$window_until.css('left', -this.$slider_container.position().left + this.$space.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 + this.$line_active.width() < 0)
            this.$window_until.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() + this.$line_active.width() < this.$touch_until.position().left + 10)
            this.$window_from.css('left', -this.$slider_container.position().left + this.$space.width());
    }
    RedrawYear() {
        let width = Math.floor(this.$space.width());
        this.ChangeSizeRowForYear(width, this.year_count);
        this.$dates_years.children().width(this.size * 2);
        if (this.year_count > 1) {
            this.$dates_years.children(':first-child').width(this.size);
            this.$dates_years.children(':last-child').width(this.size);
        }
    }
    ChangeSizeRowForYear(width, count) {
        switch (count) {
            case 1:
                this.size = width / 2;
                break;
            case 2:
                this.size = Math.floor(width / 2);
                break;
            default:
                this.size = Math.floor(width / (2 * count - 2));
                break;
        }
        if (this.size < 79)
            this.size = 79;
    }
    DrawLineForYear() {
        let left_from = 1 + (this.year_from_active - this.year_from) * 2 * this.size + this.size / 6 * (this.month_from_active); //
        let left_until = 1 + (this.year_until_active - this.year_from) * 2 * this.size + this.size / 6 * (this.month_until_active); // + this.size / 6 * (this.month_until_active - 1)
        let width_line = left_until - left_from;
        this.$touch_from.css('left', left_from);
        this.$touch_until.css('left', left_until);
        this.$line_active.css('left', left_from + 5);
        this.$line_active.width(width_line);
        this.$window_from.css('left', left_from + 10);
        this.$window_until.css('left', left_until + 10);
    }
    RedrawMonth() {
        let width = Math.floor(this.$space.width());
        this.ChangeSizeRowForMonth(width, this.year_count);
        this.$dates_months.children().width(this.size * 2);
    }
    ChangeSizeRowForMonth(width, count) {
        let size = width / count / 24;
        if (size < 22)
            size = 22;
        this.size = size;
    }
    DrawLineForMonth() {
        let left_from = (this.year_from_active - this.year_from) * 24 * this.size + 2 * this.size * this.month_from_active; //
        let left_until = (this.year_until_active - this.year_from) * 24 * this.size + 2 * this.size * this.month_until_active; // + this.size / 6 * (this.month_until_active - 1)
        let width_line = left_until - left_from;
        this.$touch_from.css('left', left_from);
        this.$touch_until.css('left', left_until);
        this.$line_active.css('left', left_from + 5);
        this.$line_active.width(width_line);
        this.$window_from.css('left', left_from + 10);
        this.$window_until.css('left', left_until + 10);
    }
    MoveYears(e, param, startX, l) {
        let left;
        switch (param) {
            case 'wheel':
                l = this.$slider_container.position().left;
                e.originalEvent.wheelDelta < 0 ? left = l + e.originalEvent.offsetY : left = l - e.originalEvent.offsetY;
                break;
            case 'mousemove':
                left = l + e.pageX - startX;
                break;
            case 'touchmove':
                left = l + e.touches[0].pageX - startX;
                break;
        }
        if (left > 0)
            left = 0;
        if ((this.$space.width() - left) > this.$slider_container.width())
            left = this.$space.width() - this.$slider_container.width();
        this.$slider_container.css('left', left);
        this.$wind_slider.css('left', left);
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 < 0)
            this.$window_from.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() < this.$touch_until.position().left + 10)
            this.$window_until.css('left', -this.$slider_container.position().left + this.$space.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 + this.$line_active.width() < 0)
            this.$window_until.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() + this.$line_active.width() < this.$touch_until.position().left + 10)
            this.$window_from.css('left', -this.$slider_container.position().left + this.$space.width());
    }
    MoveTouch(param, left) {
        let left_from = this.$touch_from.position().left;
        let left_until = this.$touch_until.position().left;
        switch (param) {
            case 'from':
                if (left > (left_until - 20))
                    left = left_until - 20;
                if (left < 0)
                    left = 0;
                this.$touch_from.css('left', left);
                this.$line_active.css('left', left + 5);
                this.$window_from.css('left', left + 10);
                left_from = left;
                break;
            case 'until':
                if (left < (left_from + 20))
                    left = left_from + 20;
                if (left > (this.$dates_container.width() - 20))
                    left = this.$dates_container.width() - 20;
                this.$touch_until.css('left', left);
                this.$window_until.css('left', left + 10);
                left_until = left;
                break;
        }
        this.$line_active.width(left_until - left_from);
        this.ChangeDate();
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 < 0)
            this.$window_from.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() < this.$touch_until.position().left + 10)
            this.$window_until.css('left', -this.$slider_container.position().left + this.$space.width());
        if (this.$slider_container.position().left + this.$touch_from.position().left + 10 + this.$line_active.width() < 0)
            this.$window_until.css('left', -this.$slider_container.position().left);
        if (-this.$slider_container.position().left + this.$space.width() + this.$line_active.width() < this.$touch_until.position().left + 10)
            this.$window_from.css('left', -this.$slider_container.position().left + this.$space.width());
    }
    ChangeDate() {
        let from;
        let until;
        if (this.state == this.states.years)
            [from, until] = this.ChangeDateYears();
        if (this.state == this.states.months)
            [from, until] = this.ChangeDateMonths();
        let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        this.$window_from.children(':first-child').text(months[from[1]]);
        this.$window_from.children(':last-child').text(from[0]);
        this.$window_until.children(':first-child').text(months[until[1]]);
        this.$window_until.children(':last-child').text(until[0]);
        this.year_from_active = from[0];
        this.month_from_active = from[1];
        this.year_until_active = until[0];
        this.month_until_active = until[1];
    }
    ChangeDateYears() {
        let from = this.GetDate(this.$touch_from.position().left, this.size * 2, (2 * this.size) / 12);
        let until = this.GetDate(this.$touch_until.position().left, this.size * 2, (2 * this.size) / 12);
        return [from, until];
    }
    ChangeDateMonths() {
        let from = this.GetDate(this.$touch_from.position().left, 24 * this.size, this.size * 2);
        let until = this.GetDate(this.$touch_until.position().left, 24 * this.size, this.size * 2);
        return [from, until];
    }
    GetDate(left, w_year, w_month) {
        let count_left = Math.floor(left / w_year);
        let left_m = left - w_year * count_left;
        let year = count_left + this.year_from;
        let month = Math.floor(left_m / w_month);
        return [year, month];
    }
}
//# sourceMappingURL=slider.js.map