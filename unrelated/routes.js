//time route, takes current date object and displays the time in 24 hr format EST
exports.time = function time(res, date)
{
	//time variables from date objec
	//hour is converted from UTC to EST, 24 hour format
	//EST is 5 hours behind EST, but if hour - 5 is negative then 19 ia added to fix the format
	let hour = date.getHours();
	if((hour - 5) < 0)
	{
		hour = hour + 19;
	}
	else
	{
		hour = hour - 5;
	}

	//fixes minute formatting to two places
	let minute = date.getMinutes();
	if(minute < 10)
	{
		minute = "0" + minute;
	}
	
	//display
	res.write(hour + ":" + minute);
	res.end();
}
//today route, takes current date object and displays day, month, year
exports.today = function today(res, date)
{
	//numbercal day month and year values from date object
	//dictionary created to convert month number to the actual word
	let day = date.getDate();
	let month = date.getMonth();
	let year = date.getFullYear();
	let dict = {0: "January", 1: "February", 2: "March", 3: "April", 4: "May", 5: "June", 6: "July",
	7: "August", 8: "September", 9: "October", 10: "November", 11: "December"};
	
	//display
	res.write(day + " " + dict[month] + ", " +  year);
	res.end();
}
//dateToDay route, creates new arbitraty date object depending values in the url queries entered
//uses that new date object to determine the day of the week of that date
exports.dateToDay = function dateToDay(res, q, date)
{
	//dictionary to change numerical day of the week to literal word
	let days = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
	d = new Date(q.year , q.month - 1, q.date, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

	//display
	res.write(days[d.getDay()]);
	res.end();
}
//error route, displays error if trying to visit invalid routes
exports.error = function error(res)
{
	res.write("Invalid route. Try /time or /today");
        res.end();
}
