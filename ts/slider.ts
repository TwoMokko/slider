class Slider {
	year_from							: number;
	year_until							: number;
	year_count							: number;

	count								: number;
	years								: number;
	x_from								: number;
	x_until								: number;
	// month_from						: number;
	// month_until						: number;
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
	$touch_until						: JQuery;
	$window_from						: JQuery;
	$window_until						: JQuery;
	$dates_container					: JQuery;
	$dates_years						: JQuery;
	$dates_months						: JQuery;

	constructor(container: JQuery, from_year: number, until_year: number, date_from: Date, date_until: Date) {
		this.year_from					= from_year;
		this.year_until					= until_year;
		this.year_from_active			= date_from.getFullYear();
		this.year_until_active			= date_from.getFullYear();
		this.month_from_active			= date_from.getMonth();
		this.month_until_active			= date_from.getMonth();

		this.year_count = this.year_until - this.year_from + 1;

		/* Elements */
		// let $container				= container;
		this.$switcher					= $('<div/>', { class: 'switcher' });
		this.$switch_years				= $('<span/>', { class: 'switch_years active', text: 'Все года' });
		this.$switch_months				= $('<span/>', { class: 'switch_months inactive', text: 'Месяца' });
		this.$space						= $('<div/>', { class: 'space' });
		this.$slider_container			= $('<div/>', { class: 'slider_container' });
		this.$line_container			= $('<div/>', { class: 'line_container' });
		this.$line						= $('<div/>', { class: 'line' });
		this.$line_active				= $('<div/>', { class: 'line_active' });
		this.$touch_from				= $('<div/>', { class: 'touch from' });
		this.$touch_until				= $('<div/>', { class: 'touch until' });
		this.$window_from				= $('<div/>', { class: 'window_from' });
		this.$window_until				= $('<div/>', { class: 'window_until' });
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
								this.$touch_from,
								this.$touch_until
							),
							this.$window_from,
							this.$window_until
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
		this.$switch_years.on('click', () => { this.DoSwitch('years'); })
		this.$switch_months.on('click', () => { this.DoSwitch('months') })
		this.$touch_from.on('mousedown', () => { /* mousemove и mouseup */ })
		this.$touch_until.on('mousedown', () => { /* mousemove и mouseup */ })

		this.$dates_years.on('mousedown', () => { /* mousemove и mouseup */ })
		this.$dates_years.on('wheel', () => {})
		this.$dates_months.on('mousedown', () => { /* mousemove и mouseup */ })
		this.$dates_months.on('wheel', () => {})

		this.CreateSliderDates();
		this.Redraw();
		$(window).on('resize', () => { this.Redraw(); });
	}

	private CreateSliderDates(): void {
		let months = ['фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
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
		let size = this.GetSizeRowForYear(width, count);
		this.$dates_years.children().width(size * 2);
		this.$dates_years.children(':first-child').width(size);
		this.$dates_years.children(':last-child').width(size);
	}

	private GetSizeRowForYear(width, count): number {
		let size;
		switch (count) {
			case 1: size = width; break;
			case 2: size = Math.floor(width / 2); break;
			default: size = Math.floor(width / (2 * count - 2)); break;
		}
		if (size < 79) size = 79;

		return size;
	}

	private GetCount(): number { return 0; }

	private TouchFrom(): void {}
	private TouchUntil(): void {}
}