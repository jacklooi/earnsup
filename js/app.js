(function() {
	var app = angular.module('app',[ ]).run(['$anchorScroll', function () { }]);;
	
	app.controller('PanelController', function() {
		this.tab = 1;
		
		this.selectTab = function(setTab) {
			this.tab = setTab;
		};
		
		this.isSelected = function(checkTab) {
			return this.tab === checkTab;
		};
	});
	
	app.controller('StockController', function() {
		this.stock = {};
		
		this.addStock = function() {
			portfolio[0].purchase.push(this.stock);
			this.stock = {};
			calcPL();
		};
	});
	
	app.controller('PortfolioController', function() {
		this.portfolio = portfolio[0];
		this.stockPurchase = portfolio[0].purchase;
		calcPL();
		this.setting = shareRate[0];
		
		this.deleteStock = function(idx) {
			this.stockPurchase.splice(idx,1);
			calcPL();
		};
	});
	
	app.controller('RateController', function() {
		this.setting = shareRate[0];
	});
	
	app.controller('CalculationController', function() {
		this.share = shareRate[0];
		this.stock = portfolio[0].purchase;
		this.portfolio = portfolio[0];
		
		this.clearingFee = function() {
			var total=0;
			for(var i=0; i<this.stock.length; i++)
			{
				total += (this.stock[i].price * this.stock[i].unit * this.share.perLot); 
			}
			
			total += (this.portfolio.sellPrice * this.portfolio.sellUnit * this.share.perLot);
			
			return total*(this.share.clearPerc/100);
		};
		
		this.stampDuty = function() {
			var sumTotal=0;
			var rate = this.share.stampRate/1000;
			for(var i=0; i<this.stock.length; i++)
			{
				var total = this.stock[i].price * this.stock[i].unit * this.share.perLot;
				if(total*rate < 1) {
					total = 1;
				}
				else {
					total = total*rate;
				}
				sumTotal += total;
			}
			
			var sellTotal = 0;
			if (this.portfolio.sellPrice != null && this.portfolio.sellPrice != 0 && this.portfolio.sellUnit != 0) {
				sellTotal = this.portfolio.sellPrice * this.portfolio.sellUnit * this.share.perLot; 
				if(sellTotal*rate < 1 && sellTotal*rate > 0) {
					sellTotal = 1;
				}
				else {
					sellTotal = sellTotal*rate;
				}
			}
			return Math.ceil(sumTotal)+Math.ceil(sellTotal); //Move upward for integer.
		};
		
		this.brokerageFee = function() {
			var sumTotal = 0;
			var rate = this.share.brokerage/100;
			for(var i=0; i<this.stock.length; i++)
			{
				var total = this.stock[i].price * this.stock[i].unit * this.share.perLot;
				if(total*rate < this.share.minBroker) {
					total = this.share.minBroker;
				}
				else {
					total = total*rate;
				}
				sumTotal += total;
			}
			
			portfolio[0].sellNet = this.portfolio.sellPrice * this.portfolio.sellUnit * this.share.perLot;
			
			if (this.portfolio.sellPrice != null && this.portfolio.sellPrice != 0 && this.portfolio.sellUnit != 0) {
				var total = this.portfolio.sellPrice * this.portfolio.sellUnit * this.share.perLot;
				
				if(total*rate < this.share.minBroker)  {
					total = this.share.minBroker;
				}
				else {
					total = total*rate;
				}
				sumTotal += total;
			}
			
			if(!this.share.gstExempt) {
				sumTotal += sumTotal*(this.share.gstPerc/100);
			}
			return sumTotal;
		};
	});
	
	this.calcPL = function() {
		var sumTotal = 0;
		var sumUnit = 0;
		var midPrice = 0;
		var totalValue = 0;
		
		var setup = shareRate[0];
		//var result = summaryTable[0].results;
		var stockItem = portfolio[0].purchase;
		
		
		for(var i=0; i<stockItem.length; i++)
		{
			var total = stockItem[i].price * stockItem[i].unit * setup.perLot;
			sumUnit += stockItem[i].unit;
			sumTotal += total;
		}
		
		portfolio[0].sellUnit = sumUnit;
		
		if(sumUnit==0){
			sumUnit = 1;
		}
		midPrice = sumTotal/(sumUnit * setup.perLot);
		
		portfolio[0].expenses = sumTotal;
		portfolio[0].avgPrice = midPrice;
		
	};
	
	var shareRate = [
		{
			currency : 'RM',
			clearPerc : 0.03,
			stampRate : 1,
			brokerage : 0.1,
			minBroker : 8,
			gstExempt : true,
			gstPerc : 6,
			perLot : 100
		}
	];
	
	var portfolio = [
		{
			sellPrice : 0,
			sellUnit : 5,
			sellNet : 0,
			avgPrice : 0,
			expenses : 0,
			fees : 0,
			purchase : [
				{
					price : 2,
					unit : 5
				}
			]
		}
	];	
})();


