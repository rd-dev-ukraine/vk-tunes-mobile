/// <reference path="vk.d.ts" />

interface AudioInfo {
    remote: VkAudioRecord;
    local: StoredAudioRecord;
    fileSize: number;
    isInMyAudio: boolean;
}