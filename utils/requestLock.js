class RequestLock {
	constructor({ maxRequests = 2 }){
		this.currentRequestCount = 0;
		this.maxConCurrentRequestCount = maxRequests;
	}

	addRequest = () => {
		if(this.currentRequestCount >= 2) {
			throw new Error("Two Concurrent Requests Allowed");
		}
		this.currentRequestCount += 1;
	}

	removeRequest = () => {
		if(this.currentRequestCount == 0){
			return;
		}
		this.currentRequestCount -= 1;
	}
}

module.exports = RequestLock;