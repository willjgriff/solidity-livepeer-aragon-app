/*
 * SPDX-License-Identitifer:    GPL-3.0-or-later
 *
 * This file requires contract dependencies which are licensed as
 * GPL-3.0-or-later, forcing it to also be licensed as such.
 *
 * This is the only file in your project that requires this license and
 * you are free to choose a different license for the rest of the project.
 */

pragma solidity 0.4.24;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-token-manager/contracts/TokenManager.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";

import "./LivepeerDelegator.sol";

contract KitBase is APMNamehash {
    ENS public ens;
    DAOFactory public fac;

    event DeployInstance(address dao);
    event InstalledApp(address appProxy, bytes32 appId);

    function KitBase(DAOFactory _fac, ENS _ens) {
        ens = _ens;

        // If no factory is passed, get it from on-chain bare-kit
        if (address(_fac) == address(0)) {
            bytes32 bareKit = apmNamehash("bare-kit");
            fac = KitBase(latestVersionAppBase(bareKit)).fac();
        } else {
            fac = _fac;
        }
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId)).addr(appId));
        (,base,) = repo.getLatest();

        return base;
    }
}

contract Kit is KitBase {
    MiniMeTokenFactory tokenFactory;
    address livepeerController;

    uint64 constant PCT = 10 ** 16;
    address constant ANY_ENTITY = address(-1);

    function Kit(ENS ens, address _livepeerController) KitBase(DAOFactory(0), ens) {
        tokenFactory = new MiniMeTokenFactory();
        livepeerController = _livepeerController;

    }

    function newInstance() {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());
        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

        address root = msg.sender;
        bytes32 appId = apmNamehash("livepeer");
        bytes32 votingAppId = apmNamehash("voting");
        bytes32 tokenManagerAppId = apmNamehash("token-manager");

        LivepeerDelegator app = LivepeerDelegator(dao.newAppInstance(appId, latestVersionAppBase(appId)));

        Voting voting = Voting(dao.newAppInstance(votingAppId, latestVersionAppBase(votingAppId)));
        TokenManager tokenManager = TokenManager(dao.newAppInstance(tokenManagerAppId, latestVersionAppBase(tokenManagerAppId)));

        MiniMeToken token = tokenFactory.createCloneToken(MiniMeToken(0), 0, "App token", 0, "APP", true);
        token.changeController(tokenManager);

        app.initialize(livepeerController);
        tokenManager.initialize(token, true, 0);
        // Initialize apps
        voting.initialize(token, 50 * PCT, 20 * PCT, 1 days);

        acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), this);
        tokenManager.mint(root, 1); // Give one token to root

        acl.createPermission(ANY_ENTITY, voting, voting.CREATE_VOTES_ROLE(), root);
        acl.grantPermission(voting, tokenManager, tokenManager.MINT_ROLE());


        // Agent Permissions
        acl.createPermission(ANY_ENTITY, app, app.SET_CONTROLLER_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.TRANSFER_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.APPROVE_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.BOND_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.APPROVE_AND_BOND_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.CLAIM_EARNINGS_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.UNBOND_ROLE(), root);
        acl.createPermission(ANY_ENTITY, app, app.WITHDRAW_STAKE_ROLE(), root);


        // Clean up permissions
        acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

        acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

        DeployInstance(dao);
    }
}
