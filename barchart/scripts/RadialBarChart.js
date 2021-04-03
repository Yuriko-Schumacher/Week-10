function RadialBarChart() {
	this._data = null;
	this._sel = null;
	this._colorScale = null;
	this._size = 180;
	this._outerRadius = 400;
	this._innerRadius = 150;

	this.data = function () {
		if (arguments.length > 0) {
			this._data = arguments[0];
			return this;
		}
		return this._data;
	};

	this.selection = function () {
		if (arguments.length > 0) {
			this._sel = arguments[0];
			return this;
		}
		return this._sel;
	};

	this.colorScale = function () {
		if (arguments.length > 0) {
			this._colorScale = arguments[0];
			return this;
		}
		return this._colorScale;
	};

	this.size = function () {
		if (arguments.length > 0) {
			this._size = arguments[0];
			this._outerRadius = this._size / 2;
			return this;
		}
		return this._size;
	};

	this.draw = function () {
		console.log(this._data);

		// create xScale
		let xScale = d3
			.scaleBand()
			.domain(this._data.map((d) => d.name))
			.range([0, 2 * Math.PI]);

		// adjust/consider the area expansion as you go further from the center
		let yScale = d3
			.scaleRadial()
			.domain([0, d3.max(this._data, (d) => d.total)])
			.range([this._innerRadius, this._outerRadius]);

		let arc = d3
			.arc()
			.innerRadius((d) => yScale(d.prevTotal))
			.outerRadius((d) => yScale(d.prevTotal + d.value))
			.startAngle(0)
			.endAngle(xScale.bandwidth())
			.padAngle(0.03)
			.padRadius(this._innerRadius);

		this._drawXAxis(xScale);
		this._drawYAxis(yScale);

		let barG = this._sel
			.append("g")
			.classed("bars", true)
			.selectAll("g")
			.data(this._data)
			.join("g")
			.attr(
				"transform",
				(d) => `rotate(${(xScale(d.name) * 180) / Math.PI})`
			);

		barG.selectAll("path")
			.data((d) => d.arr)
			.join("path")
			.attr("d", arc)
			.attr("fill", (d) => this._colorScale(d.key))
			.attr("stroke", "gray")
			.attr("stroke-width", 1)
			.attr("opacity", 0.8);
	};

	this._drawXAxis = function (xScale) {
		let xAxisG = this._sel.append("g").classed("axis-x", true);

		xAxisG
			.selectAll("g")
			.data(xScale.domain())
			.join("g")
			.attr("name", (d) => d)
			.attr("transform", (d) => {
				let radians = xScale(d) + xScale.bandwidth() / 2;
				let degrees = (radians * 180) / Math.PI - 180;
				return `rotate(${degrees}) translate(${
					this._innerRadius - 15
				}, 0)`;
			})
			.call((g) => {
				g.selectAll("text")
					.data((d) => [d]) // making it an array of one name
					// datum: many to one mapping
					// data: one to one mapping
					.join("text")
					.text((d) => d)
					.attr("text-anchor", "middle")
					.attr("transform", (d) => {
						let angle =
							((xScale(d) + xScale.bandwidth() / 2 + Math.PI) %
								2) *
							Math.PI;
						let rotate = 90;
						if (angle < Math.PI) {
							rotate = -90;
						}
						return `rotate(${rotate}) translate(0, 3)`; // 3... depends on the size of the text
					});
			})
			.call((g) => {
				g.selectAll("line")
					.data([0])
					.join("line")
					.attr("x1", 8)
					.attr("x2", 10)
					.attr("stroke", "#000");
			});
	};

	this._drawYAxis = function (yScale) {
		let yAxisG = this._sel.append("g").classed("axis-y", true);

		yAxisG.call((g) => {
			g.selectAll("g")
				.data(yScale.ticks(3)) // give us three values that are part of the yScale in an array
				.join("g")
				.call((g) => {
					// create a circle
					g.append("circle").attr("r", (d) => yScale(d));
				})
				.call((g) => {
					// create a label
					g.append("text")
						.attr("y", (d) => -yScale(d))
						.text((d) => d);
				});
		});
	};

	return this;
}
