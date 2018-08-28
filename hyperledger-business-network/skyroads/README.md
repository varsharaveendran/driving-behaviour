# skyroads

********************************************************************
			INSTALLATION AND DEPENDENCIES
********************************************************************
1. Try Hyperledger composer playground online at: http://composer-playground.mybluemix.net/ 
2. Local installation of Composer Playground: curl -sSL https://hyperledger.github.io/composer/install-hlfv1.sh | bash
3. Download Fabric dependencies: https://hyperledger.github.io/composer/installing/development-tools.html

********************************************************************
		RUNNING COMPOSER PLAYGROUND WITH FABRIC
********************************************************************
1. After finishing step 3 above, run:
cd ~/fabric-tools
./downloadFabric.sh
./startFabric.sh
This will start the CA, Orderer, CouchDB and Peer nodes necessary to deploy a business network to this Fabric network.

2. Open composer playground by running command: composer-playground
3. In the same tab as the default Fabric PeerAdmin card, create a new admin card for a business network:
https://hyperledger.github.io/composer/tutorials/playground-tutorial.html

4. Create a business network definition (or import skyroads.bna):
https://hyperledger.github.io/composer/tutorials/developer-tutorial.html

5. Issue identities to each of the participants by going into the admin card and opening identities on the top right of Playground.
Alternativey: https://hyperledger.github.io/composer/managing/identity-issue.html

6. Check if identities are issued correctly by:
composer card list

6. Start a ReST server for the deployed business network:
composer-rest-server -u <card_name> -p <port_no>
https://hyperledger.github.io/composer/integrating/getting-started-rest-api.html
Note: For multiple identities, either a ultiple user ReST server, or multiple ReST servers need to be launched.
