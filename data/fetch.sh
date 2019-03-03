DATA_PATH="raw"
mkdir -p $DATA_PATH

NULL_FILESIZE=2

DEFAULT_YEAR=$(date +%Y)
DEFAULT_MONTH=$(date +%m)
DEFAULT_FORCE=false

fetch() {
  YEAR=${1:-$DEFAULT_YEAR}
  MONTH=${2:-$DEFAULT_MONTH}
  FORCE=${3:-$DEFAULT_FORCE}

  ZERO_MONTH=$(printf %02d $((10#$MONTH))) # zero padding

  URL="https://www.google.com/doodles/json/$YEAR/$ZERO_MONTH?full=1"
  FILEPATH="$DATA_PATH/$YEAR-$ZERO_MONTH.json"

  if [[ $FORCE != true ]]
  then
    if [[ -f "$FILEPATH" ]]
    then
      # no doodles this month
      FILESIZE=$(wc -c < "$FILEPATH")
      if [[ $FILESIZE -eq $NULL_FILESIZE ]]
      then
        echo "NULL: $FILEPATH"
        return
      fi

      # complete json
      BEG=$(head -c2 "$FILEPATH")
      END=$(tail -c2 "$FILEPATH")
      if [[ $BEG == '[{' && $END == '}]' ]]
      then
        echo "SKIP: $FILEPATH"
        return
      fi
    fi
  fi

  # new file OR incomplete json
  echo "FETCH: $FILEPATH"

  wget $URL -O "$FILEPATH" -q --show-progress
}
