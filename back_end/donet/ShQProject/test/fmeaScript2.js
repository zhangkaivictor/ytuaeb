
function GenerateId()
{
	var array = new Uint32Array(1);
	var id = window.crypto.getRandomValues(array);
	return String(array.join());
}

function Row()
{
	this.id = GenerateId();
	this.name = "";

	this.ParentId = null;
}

var rows = {};

Row.prototype.GetParent = function() {
	if(rows.hasOwnProperty(this.ParentId) == true)
	{
		return rows[this.ParentId];
	}
	else
	{
		return null;
	}
};

function Test()
{
	var w = new Row();
	w.name = "parent";

	for(var i = 0; i < 10000; i++)
	{
		var child = new Row();
		child.name = "child";

		rows[w.id]=w;
		rows[child.id]=child;


		w.ParentId = child.id;
	}

	console.log(rows);

	console.log(w.GetParent());
}