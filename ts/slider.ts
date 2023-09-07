enum States {
	Years,
	Months
}

class Slider {
	state								: number;
	year_from							: number;
	year_until							: number;
	year_count							: number;

	size								: number;
	years								: number;
	year_from_active					: number;
	year_until_active					: number;
	month_from_active					: number;
	month_until_active					: number;

	$switcher							: JQuery;
	$switch_years						: JQuery;
	$switch_months						: JQuery;
	$space								: JQuery;
	$slider_container					: JQuery;
	$line_container						: JQuery;
	$line								: JQuery;
	$line_active						: JQuery;
	$touch_from							: JQuery;
	$touch_from_circle					: JQuery;
	$touch_until						: JQuery;
	$touch_until_circle					: JQuery;
	$window_from						: JQuery;
	$window_until						: JQuery;
	$dates_container					: JQuery;
	$dates_years						: JQuery;
	$dates_months						: JQuery;

	constructor(container: JQuery, from_year: number, until_year: number, date_from: Date, date_until: Date) {
		this.year_from					= from_year;
		this.year_until					= until_year;
		this.year_from_active			= date_from.getFullYear();
		this.year_until_active			= date_until.getFullYear();
		this.month_from_active			= date_from.getMonth();
		this.month_until_active			= date_until.getMonth();

		if (this.year_from_active < from_year || this.year_until_active > until_year) { container.append($('<div/>', {class: 'error', text: 'Неправильно введены данные'})); return; }

		this.year_count = this.year_until - this.year_from + 1;
		this.state = States.Months;

		/* Elements */
		this.$switcher					= $('<div/>', { class: 'switcher' });
		this.$switch_years				= $('<span/>', { class: 'switch_years active', text: 'Все года' });
		this.$switch_months				= $('<span/>', { class: 'switch_months inactive', text: 'Месяца' });
		this.$space						= $('<div/>', { class: 'space' });
		this.$slider_container			= $('<div/>', { class: 'slider_container' });
		this.$line_container			= $('<div/>', { class: 'line_container' });
		this.$line						= $('<div/>', { class: 'line' });
		this.$line_active				= $('<div/>', { class: 'line_active' });
		this.$touch_from				= $('<div/>', { class: 'touch_container' });
		this.$touch_from_circle			= $('<div/>', { class: 'touch from' });
		this.$touch_until				= $('<div/>', { class: 'touch_container' });
		this.$touch_until_circle		= $('<div/>', { class: 'touch until' });
		this.$window_from				= $('<div/>', { class: 'window from' });
		this.$window_until				= $('<div/>', { class: 'window until' });
		this.$dates_container			= $('<div/>', { class: 'dates_container' });
		this.$dates_years				= $('<div/>', { class: 'dates years' });
		this.$dates_months				= $('<div/>', { class: 'dates months hide' });


		/* Building DOM */
		container.append(
			$('<div/>', {class: 'slider'}).append(
				this.$switcher.append(
					$('<div/>' ).append(this.$switch_years),
					$('<div/>' ).append(this.$switch_months)
				),
				this.$space.append(
					this.$slider_container.append(
						this.$line_container.append(
							this.$line.append(
								this.$line_active,
								this.$touch_from.append(this.$touch_from_circle, this.$window_from.append($('<div/>'), $('<div/>'))),
								this.$touch_until.append(this.$touch_until_circle, this.$window_until.append($('<div/>'), $('<div/>')))
							)
						),
						this.$dates_container.append(
							this.$dates_years,
							this.$dates_months
						)
					)
				)
			)
		);

		/* Events */
		this.$switch_years.on('click', () => { this.state = States.Years; this.DoSwitch('years'); });
		this.$switch_months.on('click', () => { this.state = States.Months; this.DoSwitch('months'); });

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
			$(window).on('mousemove.slider', (e) => { this.MoveYears(e, 'mousemove', startX, l) });
			$(window).on('mouseup.slider', (e) => { $(window).off('mousemove.slider'); $(window).off('mouseup.slider'); });
		});
		this.$dates_months.on('touchstart.slider', (e) => {
			let startX = e.touches[0].pageX;
			let l = this.$slider_container.position().left;
			$(window).on('touchmove.slider', (e) => { this.MoveYears(e, 'touchmove', startX, l); });
			$(window).on('touchend.slider', (e) => {$(window).off('touchmove.slider'); $(window).off('touchend.slider'); });
		});
		// this.$dates_months.on('wheel', (e) => {});


		this.CreateSliderDates();
		this.Redraw();
		this.DrawLine();
		this.ChangeDate();

		$(window).on('resize', () => { this.Redraw(); this.DrawLine(); });
	}

	private CreateSliderDates(): void {
		let months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
		for (let i = 0; i <= (this.year_until - this.year_from); i++) {
			this.$dates_years.append($('<span/>', { class: 'year', text: this.year_from + i }));
		}
		for (let i = this.year_from; i <= this.year_until; i++ ) {
			this.$dates_months.append($('<span/>', { class: 'month', text: i }));
			for (const month of months) {
				this.$dates_months.append($('<span/>', { class: 'month', text: month }));
			}
		}
		this.$dates_months.append($('<span/>', { class: 'month', text: this.year_until + 1 }));
	}

	private DoSwitch(param) {
		switch (param) {
			case 'years':
				if (this.$switch_years.hasClass('active')) return;
				this.$switch_years.removeClass('inactive').addClass('active');
				this.$switch_months.removeClass('active').addClass('inactive');
				this.$dates_years.removeClass('hide');
				this.$dates_months.addClass('hide');
				break;
			case 'months':
				if (this.$switch_months.hasClass('active')) return;
				this.$switch_months.removeClass('inactive').addClass('active');
				this.$switch_years.removeClass('active').addClass('inactive');
				this.$dates_months.removeClass('hide');
				this.$dates_years.addClass('hide');
				break;
		}
	}

	private Redraw(): void {
		let width = Math.floor(this.$space.width());
		this.RedrawYear(width, this.year_count);

	}

	private RedrawYear(width, count): void {
		this.GetSizeRowForYear(width, count);
		this.$dates_years.children().width(this.size * 2);
		this.$dates_years.children(':first-child').width(this.size);
		this.$dates_years.children(':last-child').width(this.size);
	}

	private GetSizeRowForYear(width, count): void {
		switch (count) {
			case 1: this.size = width; break;
			case 2: this.size = Math.floor(width / 2); break;
			default: this.size = Math.floor(width / (2 * count - 2)); break;
		}
		if (this.size < 79) this.size = 79;
	}

	private DrawLine(): void {
		let left_from = (this.year_from_active - this.year_from) * 2 * this.size + this.size / 6 * (this.month_from_active - 1);//
		let left_until = (this.year_until_active - this.year_from) * 2 * this.size + this.size / 6 * (this.month_until_active - 1);// + this.size / 6 * (this.month_until_active - 1)
		let width_line = left_until - left_from;

		this.$touch_from.css('left', left_from);
		this.$touch_until.css('left', left_until);
		this.$line_active.css('left', left_from + 5);
		this.$line_active.width(width_line);
	}

	private MoveYears(e, param: string, startX ?: number, l ?: number): void {
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
		if (left > 0) left = 0;
		if ( ( this.$space.width() - left ) > this.$slider_container.width() ) left = this.$space.width() - this.$slider_container.width();
		this.$slider_container.css('left', left);
	}

	private MoveTouch(param: string, left): void {
		let left_from = this.$touch_from.position().left;
		let left_until = this.$touch_until.position().left;
		switch (param) {
			case 'from':
				if ( left > (left_until - 20) ) left = left_until - 20;
				if ( left < 0 ) left = 0;
				this.$touch_from.css('left', left);
				this.$line_active.css('left', left + 5);
				left_from = left;
				break;
			case 'until':
				if ( left < (left_from + 20) ) left = left_from + 20;
				if ( left > (this.$dates_container.width() - 20)) left = this.$dates_container.width() - 20;
				this.$touch_until.css('left', left);
				left_until = left;
				break;
		}
		this.$line_active.width(left_until - left_from);
		this.ChangeDate();
	}

	private GetDate(left): number[] {
		let count_left = Math.floor(left / this.size / 2);
		let size_m = (2 * this.size) / 12;
		let left_m = left - 2 * this.size * count_left;
		let year = count_left + this.year_from;

		let month = Math.floor(left_m / size_m);
		return [year, month];
	}

	private ChangeDate(): void {
		let from = this.GetDate(this.$touch_from.position().left);
		let until = this.GetDate(this.$touch_until.position().left);
		let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
		this.$window_from.children(':first-child').text(months[from[1]]);
		this.$window_from.children(':last-child').text(from[0]);
		this.$window_until.children(':first-child').text(months[until[1]]);
		this.$window_until.children(':last-child').text(until[0]);
	}
}