namespace animation {
    type ResConfig = { name: string, textureResources: string[], textures: egret.Texture[] };

    let resources: dragonBones.Map<ResConfig> = {};

    export function addGroup(groupRESName: string, textureRESNames: string | Array<string>, useRESName: boolean = false): void {
        const groupData = <ArrayBuffer>RES.getRes(groupRESName);
        if (groupData) {
            const textures: egret.Texture[] = [];
            const currentTexturesResNames: string[] = [];

            if (textureRESNames instanceof Array) {
                for (let i = 0, l = textureRESNames.length; i < l; ++i) {
                    const textureResName = textureRESNames[i];
                    const texture = RES.getRes(textureResName);
                    if (texture) {
                        textures.push(texture);
                        currentTexturesResNames.push(textureResName);
                    }
                    else {
                        throw new Error("No texture named: " + textureResName);
                    }
                }
            }
            else {
                const texture = RES.getRes(textureRESNames);
                if (texture) {
                    textures.push(texture);
                    currentTexturesResNames.push(textureRESNames);
                }
                else {
                    throw new Error("No texture named: " + textureRESNames);
                }
            }

            resources[groupRESName] = { name: groupRESName, textureResources: currentTexturesResNames, textures: textures };

            dragonBones.addMovieGroup(groupData, textures, useRESName ? groupRESName : null);
        }
        else {
            throw new Error("No data named: " + groupRESName);
        }
    }

    export function removeGroup(groupName: string): void {
        dragonBones.removeMovieGroup(groupName);

        const resConfig = resources[groupName];
        if (resConfig) {
            for (let i = 0, l = resConfig.textures.length; i < l; ++i) {
                resConfig.textures[i].dispose();
            }

            for (let i = 0, l = resConfig.textureResources.length; i < l; ++i) {
                RES.destroyRes(resConfig.textureResources[i]);
            }

            RES.destroyRes(resConfig.name);
        }
    }


    export function createAnimation(animationName: string, groupName: string = null): Animation {
        const movie = dragonBones.buildMovie(animationName, groupName);
        if (movie) {
            movie["_play"] = movie.play;
            movie.play = play;
        }

        return movie;
    }

    export function getAnimationNames(groupName: string): Array<string> {
        return dragonBones.getMovieNames(groupName);
    }

    export function getSoundEventManager(): egret.EventDispatcher {
        return dragonBones.EgretFactory.factory.soundEventManager;
    }

    export type Event = dragonBones.MovieEvent;
    export type Animation = dragonBones.Movie;

    let temp = {};
    function play(clipName: string = null, playTimes: number = -1): any {
        this._play(clipName, playTimes);
        return temp;
    }
}