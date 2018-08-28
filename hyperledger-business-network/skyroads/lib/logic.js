/**
 * Setup the demo
 * @param {composer.drivesmart.SetupDemo} SetupDemo - the SetupDemo transaction
 * @transaction
 */
function SetupDemo(SetupDemo) {
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var driver = factory.newResource(NS, 'Driver', 'D01');
    var driver2 = factory.newResource(NS, 'Driver', 'D02');
    var insurer = factory.newResource(NS, 'Insurer', 'I01');
    var insurer2 = factory.newResource(NS, 'Insurer', 'I02');
    var l = []
    
    driver.driver_score = 100;
    driver2.driver_score = 100;
    driver.driving_logs = l;
    driver2.driving_logs = l;
    insurer.viewable_records = l;
    insurer2.viewable_records = l;
  
    return getParticipantRegistry('composer.drivesmart.Driver')
    .then(function (participantRegistry) {
        return participantRegistry.addAll([driver,driver2]);
    })
    .then(function() {
        return getParticipantRegistry('composer.drivesmart.Insurer')})
    .then(function (participantRegistry) {
        return participantRegistry.addAll([insurer, insurer2]);
    });
}


/**
 * Create violation asset
 * @param {composer.drivesmart.LogDrivingViolation} violation - Create Violation Asset
 * @transaction
 */
function LogDrivingViolation(violation) {
    var currentParticipant = getCurrentParticipant();
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var vio = factory.newResource(NS, 'DrivingViolation', violation.violation_no);
    
    vio.driver = violation.driver;
    vio.violation_details = violation.violation_details;
    vio.violation_location = violation.violation_location;
    vio.violation_type = violation.violation_type;

    return getAssetRegistry('composer.drivesmart.DrivingViolation')
    .then(function (assetRegistry) {
        return assetRegistry.add(vio);
    })
    .then(function(){
        return getParticipantRegistry('composer.drivesmart.Driver')
    })
    .then(function(participantRegister){
        return participantRegister.exists(violation.driver.driver_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Driver does not exist");
    })
}

/**
 * Update driver score
 * @param {composer.drivesmart.UpdateScore} score - Update a driver's score
 * @transaction
 */
function UpdateScore(score) {  
    var curr_driver;
  
    return getParticipantRegistry('composer.drivesmart.Driver')
    .then(function(participantRegister){
        return participantRegister.exists(score.driver.driver_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Driver does not exist");
      else
        return getParticipantRegistry('composer.drivesmart.Driver');
    })
    .then(function(participantRegister) {
        return participantRegister.get(score.driver.driver_id);
    })
    .then(function(t_driver) {
        curr_driver = t_driver;
        curr_driver.driver_score = score.new_score; 
        return getParticipantRegistry('composer.drivesmart.Driver');
    })
    .then(function(participantRegister) {
        return participantRegister.update(curr_driver);
    })
}

/**
 * Upload data log from patient device
 * @param {composer.drivesmart.UploadDrivingLog} log - Upload the most recent log file
 * @transaction
 */
function UploadDrivingLog(log) { 
    var currentParticipant = getCurrentParticipant();
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var t_log = factory.newResource(NS, 'DrivingLog', log.log_id);
    
    t_log.driver = log.driver;
    t_log.encrypted_log = log.encrypted_log;
    t_log.file_hash = log.file_hash;
    t_log.requestors = [];
    t_log.approved_viewers = [];
  
    var curr_driver = log.driver;
    var id_list = curr_driver.driving_logs;
    id_list.push(log.log_id);
    curr_driver.driving_logs = id_list;

    return getAssetRegistry('composer.drivesmart.DrivingLog')
    .then(function (assetRegistry) {
        return assetRegistry.add(t_log);
    })
    .then(function(){
        return getParticipantRegistry('composer.drivesmart.Driver')
    })
    .then(function(participantRegister){
        return participantRegister.exists(log.driver.driver_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Driver does not exist");
      else
        return getParticipantRegistry('composer.drivesmart.Driver');
    })
    .then(function(participantRegister) {
        return participantRegister.update(curr_driver);
    })
}

/**
 * Request log from patient device
 * @param {composer.drivesmart.RequestAccessToLog} request - Request driver for a log
 * @transaction
 */
function RequestAccessToLog(request) { 
    var currentParticipant = getCurrentParticipant();
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var t_log; 
    
    return getAssetRegistry('composer.drivesmart.DrivingLog')
    .then(function (assetRegistry) {
        return assetRegistry.exists(request.log_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Log does not exist");
      else
        return getAssetRegistry('composer.drivesmart.DrivingLog');
    })
    .then(function(assetRegister) {         
        return assetRegister.get(request.log_id);
    })
    .then(function(logAsset) {
        t_log = logAsset;
        t_log.requestors.push(request.insurer.insurer_id);
        return getAssetRegistry('composer.drivesmart.DrivingLog');
    })
    .then(function(assetRegister) {
        return assetRegister.update(t_log);
    })
}

/**
 * Create major accident asset
 * @param {composer.drivesmart.LogMajorAccident} accident - Create accident Asset
 * @transaction
 */
function LogMajorAccident(accident) {
    var currentParticipant = getCurrentParticipant();
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var acc = factory.newResource(NS, 'MajorAccident', accident.accident_no);
    
    acc.driver = accident.driver;
    acc.accident_time = accident.accident_time;
    acc.accident_details = accident.accident_details;
    acc.accident_location = accident.accident_location;
  
    return getAssetRegistry('composer.drivesmart.MajorAccident')
    .then(function (assetRegistry) {
        return assetRegistry.add(acc);
    })
    .then(function() {
        return getParticipantRegistry('composer.drivesmart.Driver');
    })
    .then(function(participantRegister){
        return participantRegister.exists(accident.driver.driver_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Driver does not exist");
    })
}

/**
 * Grant insurer access to log from patient device
 * @param {composer.drivesmart.GrantAccessToLog} log - consent to upload of log file
 * @transaction
 */
function GrantAccessToLog(log) { 
    var currentParticipant = getCurrentParticipant();
    var factory = getFactory();
    var NS = 'composer.drivesmart' ;
    var t_log;
    var curr_insurer = log.insurer;
    var id_list = curr_insurer.viewable_records;
    id_list.push(log.log_id);
    curr_insurer.viewable_records = id_list;
   
    //list.splice( list.indexOf('foo'), 1 );
    
    return getParticipantRegistry('composer.drivesmart.Insurer')
    .then(function(participantRegister){
        return participantRegister.exists(log.insurer.insurer_id);
    })
    .then(function(exists) {
      if(!exists)
        throw new Error( "Insurer does not exist");
      else
        return getParticipantRegistry('composer.drivesmart.Insurer');
    })
    .then(function(participantRegister) {
        return participantRegister.update(curr_insurer);
    })
    .then(function() {
        return getAssetRegistry('composer.drivesmart.DrivingLog');
    })
    .then(function(assetRegister) {
        return assetRegister.get(log.log_id);
    })
    .then(function(log_asset) {
        //t_log = factory.newResource(NS, 'DrivingLog', log.log_id);
    
        t_log = log_asset;
        t_log.requestors.splice(t_log.requestors.indexOf(log.log_id), 1);
        t_log.approved_viewers.push(log.log_id);
        return getAssetRegistry('composer.drivesmart.DrivingLog');
    })
    .then(function(assetRegister) {
        return assetRegister.update(t_log);
    })
}