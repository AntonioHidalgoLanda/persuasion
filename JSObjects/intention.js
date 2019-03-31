/*
Sentient beings (inhabitants) will have the hability to manipulate their own entropy, i.e. decide (*intentions*) what they will do (*actions/rules*). These decisions will be based on their own internal view of the world (*World Model*) and their own urges (*goals*).

# Intentions
Intention = rule + candidate [target+] + feasibility
The intentions are the output of the inference between World Model and Goals. They can be executed.
World View (rules) X Goals (goals) => Intentions (facts) 

    * Go - change location (location may be subject of a entry requirement)
    * Persuade
        - Change relationship with other individuals and profile levels (hence allowing you to access to more locations or individuals); 
        - Add/remove Goals
    * Work - similar to persuade, but linked in a location
    * Discover (update world view)


# World model
Facts to decompose Goals in goals or intentions
Includes facts that are not goals. E.g. current view or current location

    IF Goal_1 && currentLocation.X = Y THEN intention.rule = Z; intention.candidate = W; intention.feasibility = U


# Goals
RuleSet
completion condition <until achieved|rounds|inherited|location|schedule|always>
decompose condition
    into more goals
    into intentions

    nature: <instinct|plan|dream>
    type: <Inmediate|Obscure|Routine>
* Inmediate: An action can be performed to achive it
* Obscure: No action can be performed, but it can be decomposed in smaller sub-objectives
* Routine: Has schedule. Goal only valid during a schedule or location

## Meta goals:
    // Is a [Pr] priority to <influence Pe people, of type T, in path Pa to level L> <People,Type,Path,Level,Priority>
e.g.
    Find the love
    Is a [Pr] priority to <influence [1] people, of type T, in path [true_love] to level [10]>
    <People 1, Type T, Path true_love, Level 10, Priority Pr>
    
    launch a business/charity
    Is a [Pr] priority to <influence [+10] people, of type [Investors], in path Pa to level [business_investment]> 
    <People,Type,Path,Level,Priority>
    
    Create a new sect
    Is a [Pr] priority to <influence [+50] people, of type T, in path [sect] to level L>
    <People,Type,Path,Level,Priority>

## Conditions
 * until achieved (dream)
 * rounds (planned/instincts)
 * inherited (planned)
 * location (location rutine)
 * schedule (time rutine)
 * always (dream/insticts, nature, desires, emotions)



# Inference - Dream - Resume

for each inhabitant/sentient
    Do intentions if feasible enough
        Intentions => World Model + Goals
    re-populate intentions
        Goals X WorldModel => Intentions + Goals


*/