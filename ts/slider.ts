class Slider {
	year_from						: number;
	year_until						: number;

	count							: number;
	years							: number;
	x_from							: number;
	x_until							: number;
	// month_from						: number;
	// month_until						: number;
	year_from_active				: number;
	year_until_active				: number;
	month_from_active				: number;
	month_until_active				: number;
	months							: [number, string, string, string, string, string, string, string, string, string, string, string];

	$switcher						: JQuery;
	$switch_years					: JQuery;
	$switch_months					: JQuery;
	$slider_container				: JQuery;
	$line_container					: JQuery;
	$line							: JQuery;
	$line_active					: JQuery;
	$touch_from						: JQuery;
	$touch_until					: JQuery;
	$window_from					: JQuery;
	$window_until					: JQuery;
	$dates_container				: JQuery;
	$dates_years					: JQuery;
	$dates_months					: JQuery;

	constructor(container: JQuery, from_year: number, until_year: number, date_from: Date, date_until: Date) {
		this.year_from				= from_year;
		this.year_until				= until_year;
		this.year_from_active		= date_from.getFullYear();
		this.year_until_active		= date_from.getFullYear();
		this.month_from_active		= date_from.getMonth();
		this.month_until_active		= date_from.getMonth();
		this.months					= [0, 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

		/* Elements */
		// let $container				= container;
		this.$switcher				= $('<div/>', { class: 'switcher' });
		this.$switch_years			= $('<div/>', { class: 'switch_years active', text: 'Все года' });
		this.$switch_months			= $('<div/>', { class: 'switch_months inactive', text: 'Месяца' });
		this.$slider_container		= $('<div/>', { class: 'slider_container' });
		this.$line_container		= $('<div/>', { class: 'line_container' });
		this.$line					= $('<div/>', { class: 'line' });
		this.$line_active			= $('<div/>', { class: 'line_active' });
		this.$touch_from			= $('<div/>', { class: 'touch from' });
		this.$touch_until			= $('<div/>', { class: 'touch until' });
		this.$window_from			= $('<div/>', { class: 'window_from' });
		this.$window_until			= $('<div/>', { class: 'window_until' });
		this.$dates_container		= $('<div/>', { class: 'dates_container' });
		this.$dates_years			= $('<div/>', { class: 'dates years' });
		this.$dates_months			= $('<div/>', { class: 'dates months hide' });


		/* Building DOM */
		container.append(
			this.$switcher.append(
				this.$switch_years,
				this.$switch_months
			),
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
	}

	private CreateSliderDates(): void {
		for (let i = 0; i <= (this.year_until - this.year_from); i++) {
			this.$dates_years.append($('<span/>', { class: 'year', text: this.year_from + i }));
		}
		for (let i = this.year_from; i <= this.year_until; i++ ) {
			this.months[0] = i;
			for (let j = 0; j < 12; j++) {
				this.$dates_months.append($('<span/>', { class: 'month', text: this.months[j] }));
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

	private Redraw(): void {}

	private GetCount(): number { return 0; }

	private TouchFrom(): void {}
	private TouchUntil(): void {}
}