function Sweeper(s,m) {
	this.grid = [];
	this.width = s;
	this.height = s;
	this.mines = {"flagged":0,"total":m,"used":0,"tripped":0};
	var _covered;
	this.init = function(s,m){
		this.grid.length = 0;
		this.width = s;
		this.height = s;
		this.mines = {"flagged":0,"total":m,"used":0,"tripped":0};
		_covered = this.width*this.height;
		var i, j, s2 = s*s, q = m;
		for (i=0; i<s; ++i) {
			this.grid[i] = [];
			for (j=0; j<s; ++j) {
				this.grid[i][j] = {
					"value":0,
					"surrounding":0,
					"flagged":0,
					"open":0,
					"canOpen":function(){return !this.open&&!this.flagged;},
					"toString":function(){
						return this.value>0?"X":
							(this.flagged?"!":""+this.surrounding);
					}
				};
			}
		}
		while (q>0) {
			i = (Math.random()*s)|0, j = (Math.random()*s)|0;
			if (this.grid[i][j].value===0) {
				this.grid[i][j].value = 1;
				if (i>0  &&j>0) ++this.grid[i-1][j-1].surrounding;
				if (       j>0) ++this.grid[i][j-1].surrounding;
				if (i<s-1&&j>0) ++this.grid[i+1][j-1].surrounding;
				if (i<s-1     ) ++this.grid[i+1][j].surrounding;
				if (i<s-1&&j<s-1) ++this.grid[i+1][j+1].surrounding;
				if (       j<s-1) ++this.grid[i][j+1].surrounding;
				if (i>0  &&j<s-1) ++this.grid[i-1][j+1].surrounding;
				if (i>0         ) ++this.grid[i-1][j].surrounding;
				--q;
			}
		}
		return this;
	};
	this.close = function() {
		var i, j;
		for (i=0; i<this.height; ++i) {
			for (j=0; j<this.width; ++j) {
				this.grid[j][i].flagged = 0;
				this.grid[j][i].open = 0;
			}
		}
		this.mines.flagged = 0;
	};
	this.flag = function(x,y) {
		if (this.grid[y][x].flagged) {
			this.grid[y][x].flagged = 0;
			--this.mines.used;
			if (this.grid[y][x].value>0) --this.mines.flagged;
		}
		else {
			this.grid[y][x].flagged = 1;
			++this.mines.used;
			if (this.grid[y][x].value>0) ++this.mines.flagged;
		}
	};
	this.open = function(x,y) {
		if (this.grid[y][x].canOpen()) {
			this.grid[y][x].open = 1;
			--_covered;
			if (this.grid[y][x].value>0) {
				++this.mines.tripped;
				console.log("MINE");
			}
			else if (this.grid[y][x].surrounding>0) {}
			else {
				if (x>0&&y>0) {if (this.grid[y-1][x-1].canOpen()) this.open(x-1,y-1);}
				if (x>0) {if (this.grid[y][x-1].canOpen()) this.open(x-1,y);}
				if (x>0&&y<this.height-1) {if (this.grid[y+1][x-1].canOpen()) this.open(x-1,y+1);}
				if (     y>0) {if (this.grid[y-1][x].canOpen()) this.open(x,y-1);}
				if (     y<this.height-1) {if (this.grid[y+1][x].canOpen()) this.open(x,y+1);}
				if (x<this.width-1&&y>0) {if (this.grid[y-1][x+1].canOpen()) this.open(x+1,y-1);}
				if (x<this.width-1) {if (this.grid[y][x+1].canOpen()) this.open(x+1,y);}
				if (x<this.width-1&&y<this.height-1) {if (this.grid[y+1][x+1].canOpen()) this.open(x+1,y+1);}
			}
		}
	};
	this.click = function(b,x,y) {
		console.log("CLICK("+b+")",x,y);
		if (!this.grid[y][x].open) {
			if (b>0) {
				this.flag(x,y);
			}
			else {
				this.open(x,y);
			}
		}
	};
	this.percentage = function(x,y) {
		var r = -1, q = 0;
		if (this.grid[y][x].open) {
			if (this.grid[y][x].value>0) r = -1;
			else if (this.grid[y][x].surrounding>0) {
				var _e_left = x>0, _e_top = y>0,
					_e_right = x<(this.width-1), _e_bottom = y<(this.height-1);
				r = 8;
				q = this.grid[y][x].surrounding;
				if (_e_left&&_e_top) {
					if (this.grid[y-1][x-1].open) {
						if (this.grid[y-1][x-1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_right&&_e_top) {
					if (this.grid[y-1][x+1].open) {
						if (this.grid[y-1][x+1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_left&&_e_bottom) {
					if (this.grid[y+1][x-1].open) {
						if (this.grid[y+1][x-1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_right&&_e_bottom) {
					if (this.grid[y+1][x+1].open) {
						if (this.grid[y+1][x+1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_left) {
					if (this.grid[y][x-1].open) {
						if (this.grid[y][x-1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_right) {
					if (this.grid[y][x+1].open) {
						if (this.grid[y][x+1].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_top) {
					if (this.grid[y-1][x].open) {
						if (this.grid[y-1][x].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
				if (_e_bottom) {
					if (this.grid[y+1][x].open) {
						if (this.grid[y+1][x].value>0) {++r; --q;}
						else --r;
					}
				}
				else --r;//
			}
			//else r = 0;
		}
		return r>0?q/r:q;
	}
	this.probability = function(x,y) {
		var r = 0, div = 0;	// r = open adjacent spaces
		if (this.grid[y][x].open&&this.grid[y][x].value>0) return 1;
		if (this.grid[y][x].canOpen()) {
			var _e_left = x>0, _e_top = y>0,
				_e_right = x<(this.width-1), _e_bottom = y<(this.height-1);
			if (_e_left&&_e_top) {if (this.grid[y-1][x-1].open) {++r; div += this.percentage(y-1,x-1);}}
			else ++r;
			if (_e_right&&_e_top) {if (this.grid[y-1][x+1].open) {++r; div += this.percentage(y-1,x+1);}}
			else ++r;
			if (_e_left&&_e_bottom) {if (this.grid[y+1][x-1].open) {++r; div += this.percentage(y+1,x-1);}}
			else ++r;
			if (_e_right&&_e_bottom) {if (this.grid[y+1][x+1].open) {++r; div += this.percentage(y+1,x+1);}}
			else ++r;
			if (_e_left) {if (this.grid[y][x-1].open) {++r; div += this.percentage(y,x-1);}}
			else ++r;
			if (_e_right) {if (this.grid[y][x+1].open) {++r; div += this.percentage(y,x+1);}}
			else ++r;
			if (_e_top) {if (this.grid[y-1][x].open) {++r; div += this.percentage(y-1,x);}}
			else ++r;
			if (_e_bottom) {if (this.grid[y+1][x].open) {++r; div += this.percentage(y+1,x);}}
			else ++r;
		}
		return div;//:r;//*0.125;//r>7?1:div/r;
	};
	this.covered = function() {return _covered;};
	this.complete = function() {return _covered===this.mines.total;};
	return this.init(s,m);
}
